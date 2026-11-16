package com.healthtracker.app;
import android.app.*;
import android.content.*;
import android.hardware.*;
import android.os.*;
import androidx.core.app.NotificationCompat;

public class StepForegroundService extends Service implements SensorEventListener {
 private static final String CHANNEL="wellness_steps";
 private SensorManager manager; private Sensor sensor; private int last=-1;
 @Override public void onCreate(){
   super.onCreate(); createChannel();
   startForeground(4101,notification("Step counter is active"));
   manager=(SensorManager)getSystemService(SENSOR_SERVICE);
   sensor=manager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
   if(sensor!=null) manager.registerListener(this,sensor,SensorManager.SENSOR_DELAY_NORMAL);
 }
 private void createChannel(){
   if(Build.VERSION.SDK_INT>=26){NotificationChannel c=new NotificationChannel(CHANNEL,"Daily step counter",NotificationManager.IMPORTANCE_LOW);c.setDescription("Persistent daily walking progress");((NotificationManager)getSystemService(NOTIFICATION_SERVICE)).createNotificationChannel(c);}
 }
 private Notification notification(String text){
   Intent open=getPackageManager().getLaunchIntentForPackage(getPackageName());
   PendingIntent pi=PendingIntent.getActivity(this,0,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
   return new NotificationCompat.Builder(this,CHANNEL).setSmallIcon(android.R.drawable.ic_menu_compass)
     .setContentTitle("Bloom Wellness • Steps").setContentText(text).setContentIntent(pi)
     .setOngoing(true).setOnlyAlertOnce(true).setCategory(NotificationCompat.CATEGORY_SERVICE).build();
 }
 @Override public void onSensorChanged(SensorEvent e){
   int count=(int)e.values[0]; if(last<0) last=count;
   int delta=Math.max(0,count-last); last=count;
   android.content.SharedPreferences p=getSharedPreferences("wellness_steps",MODE_PRIVATE);
   String day=new java.text.SimpleDateFormat("yyyy-MM-dd",java.util.Locale.US).format(new java.util.Date());
   String storedDay=p.getString("day","");
   int base=p.getInt("base",count);
   if(!day.equals(storedDay) || count<base){
     base=count; p.edit().putString("day",day).putInt("base",base).putInt("daily",0).apply();
   }
   int daily=Math.max(0,count-base);
   p.edit().putInt("daily",daily).apply();
   ((NotificationManager)getSystemService(NOTIFICATION_SERVICE)).notify(4101,notification(daily+" steps today • Keep blooming!"));
 }
 @Override public void onAccuracyChanged(Sensor s,int a){}
 @Override public int onStartCommand(Intent i,int flags,int id){return START_STICKY;}
 @Override public void onDestroy(){if(manager!=null)manager.unregisterListener(this);super.onDestroy();}
 @Override public android.os.IBinder onBind(Intent i){return null;}
}
