package asu.edu.surveyapp;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebSettings;
import java.io.IOException;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import android.webkit.WebViewClient;
import android.app.ProgressDialog;
import android.graphics.Bitmap;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView webView = (WebView)findViewById(R.id.webview);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAppCacheEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setDatabaseEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            private ProgressDialog progress;

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progress = new ProgressDialog(MainActivity.this);
                progress.setMessage("Loading.. Please Wait!");
                progress.show();
//                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progress.dismiss();
                super.onPageFinished(view, url);
            }
        });
        webView.loadUrl("file:///android_asset/www/index.html");


//        WebView myWebView = (WebView) findViewById(R.id.webview);
//        WebSettings webSettings = myWebView.getSettings();
//        webSettings.setJavaScriptEnabled(true);
//        myWebView.setWebChromeClient(new WebChromeClient());
//
//        String filePath = "file:///android_asset/www/index.html";
//        File file = new File(filePath);
//        myWebView.loadUrl(filePath);
//        WebView webView = (WebView) findViewById(R.id.webview);
//
//        WebSettings webSettings = webView.getSettings();
//        webSettings.setJavaScriptEnabled(true);
//        webSettings.setDomStorageEnabled(true);
//        webView.setWebChromeClient(new WebChromeClient());
//
//        try {
//            String html = readAssetFile("www/index.html");
//            webView.loadDataWithBaseURL("file:///android_asset/www/", html, "text/html", "UTF-8", null);
//        } catch (IOException e) {
//        }
    }

//    private String readAssetFile(String fileName) throws IOException {
//        StringBuilder buffer = new StringBuilder();
//        InputStream fileInputStream = getAssets().open(fileName);
//        BufferedReader bufferReader = new BufferedReader(new InputStreamReader(fileInputStream, "UTF-8"));
//        String str;
//
//        while ((str=bufferReader.readLine()) != null) {
//            buffer.append(str);
//        }
//        fileInputStream.close();
//
//        return buffer.toString();
//    }

}
