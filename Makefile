release:
	uglifyjs -o backbone-inheritance.min.js backbone-inheritance.js

tests:
	open spec/index.html

docs:
	docco backbone-inheritance.js
	open docs/backbone-inheritance.html

.PHONY: release tests docs
