# This is the Python server that will process all of the questions
# It is supposed to link duplicate questions together

import nltk

sentence = """At eight o'clock on Thursday morning Arthur didn't feel very good."""
tokens = nltk.word_tokenize(sentence)
print tokens

tagged = nltk.pos_tag(tokens)
print tagged[:6]
