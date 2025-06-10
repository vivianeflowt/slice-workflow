from gtts import gTTS
from playsound import playsound
import tempfile
import sys


def speak(text: str, lang: str = 'pt'):
    tts = gTTS(text=text, lang=lang)
    with tempfile.NamedTemporaryFile(delete=True, suffix='.mp3') as fp:
        tts.save(fp.name)
        playsound(fp.name)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        texto = ' '.join(sys.argv[1:])
    else:
        texto = input('Digite o texto para falar: ')
    speak(texto)
