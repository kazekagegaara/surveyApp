package org.cnmc.painClinic.helper;

import android.content.Context;
import android.content.res.AssetManager;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Created by Anirudha on 2/6/2015.
 * Found resources at http://khurramitdeveloper.blogspot.com/2013/07/properties-file-in-android.html
 */
public class propertiesReader {
    private Context context;
    private Properties properties;

    public propertiesReader(Context context){
        this.context=context;

        //create new properties obj
        properties=new Properties();
    }

    public Properties getProperties(String fileName){
        try {
            AssetManager assetManager = context.getAssets();

            InputStream inputStream = assetManager.open(fileName);

            properties.load(inputStream);

        } catch (IOException e) {
            Log.e("propertyReader", e.toString());
        }
        return properties;
    }
}
