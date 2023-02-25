import os
import openai
import speech_recognition as sr
from googletrans import Translator
from playsound import playsound
from gtts import gTTS
from flask import Flask, render_template, request ,jsonify
# import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
openai.api_key = "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"
translator = Translator()
language_code = 'hi'
language = 'Hindi'

def detectLanguageCode(input_text):
    if input_text is not None:
        detection_response = openai.Completion.create(
            engine="davinci",
            prompt=f"Detect the language of the following text: {input_text}\nLanguage:",
            temperature=0.7,
            max_tokens=60,
        )
        detectedlanguage = detection_response.choices[0].text.strip()
        language_code = "hi"
        print(f"Detected language: {detectedlanguage}")
        if "English" in detectedlanguage:
            language_code = 'en'
        elif "Hindi" in detectedlanguage:
            language_code = "hi"
        elif "French" in detectedlanguage:
            language_code = "fr"
        elif "German" in detectedlanguage:
            language_code = "de"
        elif "Punjabi" in detectedlanguage:
            language_code = "pa"
        # elif language == "Thai":
        #     language_code = "th"
        return language_code
    
def speak(text, lang_code="hi",name="query"):
    tts = gTTS(text=text, lang=lang_code)
    tts.save(f"{name}.mp3")
    playsound(f"{name}.mp3")
    os.remove(f"{name}.mp3")

def recognize_speech():
    r = sr.Recognizer()
    mic = sr.Microphone()
    print("speak now..")
    with mic as source:
        r.adjust_for_ambient_noise(source)
        audio = r.listen(source)

    try:
        print("Recognising...")
        recognized_text = r.recognize_google(audio)
        print(f"Recognized text: {recognized_text}")
        language_code = detectLanguageCode(recognized_text)
        google_text = translator.translate(recognized_text,dest='en').text
        print(f"English Translation -->{google_text}")
        speak(recognized_text,language_code,"query")
        return google_text,language_code
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")

def chat_with_openai(question, language="hi"):
    prompt = f"Answer the following question in {language}: {question}\nAnswer:"
    model = "text-davinci-002"
    temperature = 0.7
    max_tokens = 1000

    response = openai.Completion.create(
        engine=model,
        prompt=prompt,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return response.choices[0].text.strip()

# input_text,language_code = recognize_speech()
name = "response"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recognise', methods=['GET','POST'])
def recognise():
    input_text = request.json['result']
    print(input_text)
    # speak(input_text,'hi',"query")
    response = chat_with_openai(input_text, 'hi')
    name = "response"
    speak(response, 'hi' , name)
    return jsonify({'message': response})

if __name__ == '__main__':
    app.run(debug=True,port=7000)