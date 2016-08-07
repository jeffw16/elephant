import socket
import nlp

class NLPServer(object):
    def __init__(self, ip, port):
	self.sock = socket.socket()
	self.sock.bind((ip, port))
	self.processor = nlp.NLPProcessor()
	print "Established Server"

    def listen(self):
	import thread
	self.sock.listen(5)
	print "Started listening at port."
	while True:
	    c = self.sock.accept()
	    cli_sock, cli_addr = c
	    
	    try:
		print 'Got connection from', cli_addr
		thread.start_new_thread(self.manageRequest, (cli_sock,))
	    except Exception, Argument:
		print Argument
		self.sock.close()
		quit()

    def manageRequest(self, cli_sock):
	data = cli_sock.recv(8192)
	result = self.processor.processQuestion(data)
	cli_sock.send(str(result))
	cli_sock.close()

# server = NLPServer('127.0.0.1', 3369)
import sys
server = NLPServer(str(sys.argv[1]), int(sys.argv[2]))
server.listen()
