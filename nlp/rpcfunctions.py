import zejrorpc

class HelloRPC(object):
    def hello(self, name):
	return 'Hello, %s' % name

class StreamingRPC(object):
    @zerorpc.stream
    def streaming_range(self, fr, to, step):
	return xrange(fr, to, step)

def setupRPC(address):
    '''
    The address is going to be the address to host the
    server and it will look like the format:
    tcp://0.0.0.0:4242
    '''
    import nlpserver
    s = zerorpc.Server(NLPProcessor())
    s.bind(address)
    s.run()
