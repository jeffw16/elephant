# This is the Python server that will process all of tthe questions
# It is supposed to link duplicate questions together

import nltk

class NLPProcessor(object):
    def __init__(self):
	self.listQuestions = []

    def tokenizeAndTag(self, question):
	'''
	Tokenizes the question and returns a list of it's tagged tokens.
	'''
	tokens = nltk.word_tokenize(question)
	taggedQuestion = nltk.pos_tag(tokens)
	return taggedQuestion

    def addQuestion(self, question):
	self.listQuestions.append(question)	

    def processQuestion(self, question):
	question = question.strip()
	max_count = 0
	best_matches = [] 
	tagged = self.tokenizeAndTag(question)	
	qDict = dict()
	for a in self.listQuestions:
	    aTagged = self.tokenizeAndTag(a)
	    qDict[a] = self.tag_similarity(aTagged, tagged)
	    if qDict[a] > max_count:
		max_count = qDict[a] 
	if max_count is not 0:
	    for a in self.listQuestions:
	        if qDict[a] == max_count:
	            best_matches.append(a)
	self.addQuestion(question)
	return (max_count, best_matches)

    def tag_similarity(self, a, b):
	count = 0
	for tag in a:
	    if tag[1].startswith('N') and tag in b:
		count += 1
	return count
