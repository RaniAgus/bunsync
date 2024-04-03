ifeq ($(OS),Windows_NT)
  OUTFILE = $(HOME)\bin\bunsync
else
  OUTFILE = $(HOME)/.local/bin/bunsync
endif

run:
	bun run bunsync.js $(ARGS)

install:
	$(SUDO) bun build ./bunsync.js --compile --outfile $(OUTFILE)

uninstall:
	rm -f $(OUTFILE)
