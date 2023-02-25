import pyttsx3
import pandas as pd
from sklearn import preprocessing
from sklearn.neighbors import KNeighborsClassifier
import numpy as np
from flask import Flask, render_template, request




app = Flask(__name__)

excel = pd.read_csv('cattle.csv')
cattle_names = excel['CATTLE'].tolist()

le = preprocessing.LabelEncoder()
cattle = le.fit_transform(cattle_names)
temperature = excel['TEMPERATURE'].tolist()
cost = excel['COST'].tolist()
area = excel['AREA'].tolist()
rainfall = excel['RAINFALL'].tolist()
features = list(zip(temperature, cost, area, rainfall))
features = np.array(features)

# Train the KNN model
knn = KNeighborsClassifier(n_neighbors=4)
knn.fit(features, cattle)

# Initialize the text-to-speech engine



def speak(audio):
    engine = pyttsx3.init('sapi5')
    voices = engine.getProperty('voices')
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate-20)
    engine.setProperty('voice', voices[0].id)
    engine.say(audio)
    engine.runAndWait()

	


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    # Get the input values from the form
    temperature = float(request.form['temperature'])
    cost = float(request.form['cost'])
    area = float(request.form['area'])
    rainfall = float(request.form['rainfall'])

    # Make the prediction
    prediction = knn.predict(
        [[temperature, cost, area, rainfall]])
    cattle_name = le.inverse_transform(prediction)[0]
    speak("Sir according to the data that you provided to me. The temperature is " + str(temperature) +"degree celsius" + ". The cost of having this cattle is  " + str(cost)+" thousand ruppes " + ". The area required for this is  " + str(area)+ " acres " + ". The rainfall around the area is  " +
          str(rainfall)+ " millimeters " + ".The best cattle that the person can keep is  " + cattle_name)
    return render_template("index.html", prediction_text="The best cattle to keep is {}".format(cattle_name))
    
    
  

if __name__ == '__main__':
    app.run(debug=True)
