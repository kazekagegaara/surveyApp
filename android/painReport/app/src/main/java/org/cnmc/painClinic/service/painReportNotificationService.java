package org.cnmc.painClinic.service;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.os.AsyncTask;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.view.View;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.cnmc.painClinic.helper.propertiesReader;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

public class painReportNotificationService extends Service {

    private PowerManager.WakeLock mWakeLock;
    private org.cnmc.painClinic.helper.propertiesReader propertiesReader;
    private String notifQueryUrl;

    public painReportNotificationService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    private void handleIntent(Intent intent) {
        //get notifQueryUrl
        propertiesReader=new propertiesReader(getApplicationContext());
        notifQueryUrl=propertiesReader.getProperties("cnmcpr.properties").getProperty("notifQueryUrl");
        //get PIN number from local storage
        String pin="2000";//to be implemented using a custom class
        //add pin number to the notifQueryUrl
        notifQueryUrl=notifQueryUrl+"?pin="+pin;

        // obtain the wake lock
        PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
        mWakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "PARTIAL_WAKE_LOCK");
        mWakeLock.acquire();

        // check the global background data setting but since getBackgroundDataService
        // is deprecated getActiveNetworkInfo is used
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (!cm.getActiveNetworkInfo().isConnected()) {
            stopSelf();
            return;
        }

        // asyncTask handles the actual polling so as not to crash the main UI thread
        if(notifQueryUrl!=null)
        {
            new PollTask().execute(notifQueryUrl);
        }
        else{
            Log.e("painReportNotificationService:","URL string is null!!!");
        }

    }

    private class PollTask extends AsyncTask<String, Void, String> {

        @Override
        protected String doInBackground(String... urls) {
            String response = "";
            for (String url : urls) {
                DefaultHttpClient client = new DefaultHttpClient();
                HttpGet httpGet = new HttpGet(url);
                try {
                    HttpResponse execute = client.execute(httpGet);
                    InputStream content = execute.getEntity().getContent();

                    BufferedReader buffer = new BufferedReader(new InputStreamReader(content));
                    String s = "";
                    while ((s = buffer.readLine()) != null) {
                        response += s;
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return response;
        }

        @Override
        protected void onPostExecute(String result) {
            int currentapiVersion = android.os.Build.VERSION.SDK_INT;
            String survey="";
            if(result != "") {
                //parse json data
                try {
                    JSONObject parentObject = new JSONObject(result);
                    survey=parentObject.getString("survey");

                    //Notification.Builder is not available for API version <11 i.e HoneyComb
                    //Else condition only applies to API level 10 i.e. Gingerbread
                    if(currentapiVersion> Build.VERSION_CODES.GINGERBREAD){
                        NotificationManager notificationManager =
                                (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

                        Notification.Builder builder = new Notification.Builder(getApplicationContext())
                                .setSmallIcon(android.R.drawable.stat_sys_download)
                                .setAutoCancel(true)
                                .setContentTitle("Pain Report")
                                .setContentText("Next Survey is available");

                        Notification notification=builder.getNotification();
                        int SERVER_DATA_RECEIVED = 1;
                        notificationManager.notify(SERVER_DATA_RECEIVED, notification);
                    }
                    else{
                        Notification noti = new NotificationCompat.Builder(getApplicationContext())
                                .setSmallIcon(android.R.drawable.stat_sys_download)
                                .setAutoCancel(true)
                                .setContentTitle("Pain Report")
                                .setContentText("Next Survey is available")
                                .setAutoCancel(true).build();
                    }
                } catch (JSONException e) {
                    Log.e("log_tag", "Error parsing data " + e.toString());
                }
                Log.d("Response",survey);
            }
            else{
                Log.e("log_tag", "No Response from server");
            }
        }
    }

    /**
     * This is deprecated, but you have to implement it if you're planning on
     * supporting devices with an API level lower than 5 (Android 2.0).
     */
    @Override
    public void onStart(Intent intent, int startId) {
        handleIntent(intent);
    }

    /**
     * This is called on 2.0+ (API level 5 or higher). Returning
     * START_NOT_STICKY tells the system to not restart the service if it is
     * killed because of poor resource (memory/cpu) conditions.
     */
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        handleIntent(intent);
        return START_NOT_STICKY;
    }

    /**
     * In onDestroy() we release our wake lock. This ensures that whenever the
     * Service stops (killed for resources, stopSelf() called, etc.), the wake
     * lock will be released.
     */
    @Override
    public void onDestroy() {
        super.onDestroy();
        mWakeLock.release();
    }
}
