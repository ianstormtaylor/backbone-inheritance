release:
	uglifyjs -o backbone-inheritance.min.js backbone-inheritance.js

test:
	open test/index.html

docs:
	docco backbone-inheritance.js
	open docs/backbone-inheritance.html

.PHONY: release test docs
