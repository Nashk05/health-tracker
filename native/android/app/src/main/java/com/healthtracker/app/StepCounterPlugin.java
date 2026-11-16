package com.healthtracker.app;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Build;
import androidx.core.content.ContextCompat;
import com.getcapacitor.*;
import com.getcapacitor.annotation.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@CapacitorPlugin(name = "StepCounter", permissions = {
 @Permission(alias="activity", strings={Manifest.permission.ACTIVITY_RECOGNITION})
})
public class StepCounterPlugin extends Plugin {
 @PluginMethod public void startTracking(PluginCall call) {
   if (Build.VERSION.SDK_INT >= 29 && getPermissionState("activity") != PermissionState.GRANTED) {
     requestPermissionForAlias("activity", call, "startTrackingAfterPermission"); return;
   }
   startService(); JSObject out=new JSObject(); out.put("started",true); call.resolve(out);
 }
 @PermissionCallback private void startTrackingAfterPermission(PluginCall call) {
   if (getPermissionState("activity") == PermissionState.GRANTED) { startService(); JSObject out=new JSObject(); out.put("started",true); call.resolve(out); }
   else call.reject("Physical activity permission denied");
 }
 private void startService() {
   Intent i=new Intent(getContext(),StepForegroundService.class);
   ContextCompat.startForegroundService(getContext(),i);
 }
 @PluginMethod public void read(PluginCall call) {
   if (Build.VERSION.SDK_INT >= 29 && ContextCompat.checkSelfPermission(getContext(),Manifest.permission.ACTIVITY_RECOGNITION)!=PackageManager.PERMISSION_GRANTED) {
     requestPermissionForAlias("activity",call,"readAfterPermission"); return;
   }
   readSensor(call);
 }
 @PermissionCallback private void readAfterPermission(PluginCall call) {
   if (getPermissionState("activity")==PermissionState.GRANTED) readSensor(call); else call.reject("Physical activity permission denied");
 }
 private void readSensor(PluginCall call) {
   SensorManager sm=(SensorManager)getContext().getSystemService(android.content.Context.SENSOR_SERVICE);
   Sensor s=sm.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
   if(s==null){call.reject("noSensor");return;}
   AtomicInteger value=new AtomicInteger(-1); CountDownLatch latch=new CountDownLatch(1);
   android.hardware.SensorEventListener listener=new android.hardware.SensorEventListener(){
     public void onSensorChanged(android.hardware.SensorEvent e){value.set((int)e.values[0]);latch.countDown();}
     public void onAccuracyChanged(Sensor s,int a){}
   };
   sm.registerListener(listener,s,SensorManager.SENSOR_DELAY_NORMAL);
   new Thread(()->{try{latch.await(4,TimeUnit.SECONDS);}catch(Exception ignored){} sm.unregisterListener(listener);
     if(value.get()<0) call.reject("timeout"); else {JSObject r=new JSObject();r.put("counter",value.get());call.resolve(r);}
   }).start();
 }
}
