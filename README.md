# Overview

This program is a web-based to-do list application that allows users to create, complete, and delete tasks. It also has implementation for creating 3 types of tasks:
-One-Time Tasks: These are simple "do it once, check it off" type tasks that can either be complete or incomplete.
-Multi-Step Tasks: When these tasks are created, the user is asked for a completion number. The task must be completed that many times before it is checked off as done.
-Eternal Tasks: These tasks are never actually considered "done." Instead, each one of these tasks is given a counter that increments by one when the "done" button is clicked, and decrements by one when "undo" is clicked.

I wrote this program the way I did to become more familiar with the JavaScript language, particularly with integrating it with an HTML file to create a working webpage. I also wanted to experiment with integrating external libraries, as I did with Lodash here.

{Provide a link to your YouTube demonstration. It should be a 4-5 minute demo of the software running and a walkthrough of the code. Focus should be on sharing what you learned about the language syntax.}

[Software Demo Video](http://youtube.link.goes.here)

# Development Environment

-Code was edited in Visual Studio Code
-Language was JavaScript packaged alongside an HTML file
-Imported the Lodash library

# Useful Websites

- [W3Schools tutorials](https://www.w3schools.com/js/)
- [Lodash Documentation](https://lodash.com/docs/4.17.15#uniqueId)

# Future Work

-Add local storage to save the list between refreshes
- Add more CSS elements to make the page prettier
- Add sound effects when creating, completing, and deleting tasks
