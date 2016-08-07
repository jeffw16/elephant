# This is the Python server that will process all of tthe questions
# It is supposed to link duplicate questions together

import nltk

class NLPProcessor(object):
    def __init__(self):
	self.listQuestions = []
	self.listQuestionsTagged = []

    def addQuestion(self, question):
	self.listQuestions.append(question)	
	tokens = nltk.word_tokenize(question)
	taggedQuestion = nltk.pos_tag(tokens)
	self.listQuestionsTagged.append(taggedQuestion)

    def checkQuestionMatch(self, question):
	pass

