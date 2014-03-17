timesheet-service
=================

Timesheet service that handles data set of existing employees and clients.

## Design questions
	- Should the service be bound to a single-company use, or should it serve multiple companies?
	- Is the wage-slip generated monthly or weekly? (part-time / full-time)
	- Is the tax rate provided/calculated by an external service?
	- What extra information does the time sheet need to ask - what other service would the data base used for other than payslips?
	- What interface would the employee use to input information? i.e. website, command line, desktop app etc.
	- How often does the user need to input the information?

	- Does the payslip include deductions i.e. taxes?
	- Does the payslip need a print-friendly format?
	- What contact details does the payslip need to contain?

	- Does the data need to be stored in a separate database or can it access an already existing one?

## Example scenario

	For purposes of the example design of the service I have assumed an employee inputs
	a number mini-projects completed throughout the course of his day at work on a daily basis.

	He enteres a job number that can be later used for accountancy, number of hours spend on each task and an optional descrption of what he has achieved.
	All input is submitted using a web interface, the application requires a unique employee number to access timesheet service.

	Payslips are issued on a montly basis and are issued at the last day of each month, thus the service collects
	all jobs completed per employee, sums up totals, calculates gross total, tax at a rate relative to each employee (takes into account individual's tax code)
	and produces a print-friendly pay slip in a web browser.

## Usage instructions

	1. Install node dependencies by running 'npm install' in projects' directory
	2. Start the web server: 'npm start'
	3. Access http://localhost:3000/
		 - Use 1 or 2 as an employee number to login
	4. Access http://localhost:3000/payslips to access payslips area
	5. Pick a date - Sample data set is within 03-2014
	6. Select employee's name to view the payslip

	7. Additoinally you can run code tests with a command: 'npm test'

## Next steps

	Due to a nature of the project (around 4 hours to be spend on this), I have left out wide range of features,
	but if given more time, or if this project was a real thing I would consider adding following features:

	- Using a database service such as Postgres or MongoDB
	- Password protected areas, such as /account page and /payslips to prevent employees from falsyfying data
	- PDF generation of the payslips for printing service integration
	- Introduce a collection of deductions that affect the payslip's values.
		Given that tax is not the only deduction, this would increase accuracy of the payslip feature

	- Scheduled auto-generation of payslips in a PDF format.
		To automate the process of delivery of the payslips, the service could be scheduled to auto-generate PDF files that can be easily sent to the printer.
		Simple CRON job would be suitable for this.

	- Proper validation of the user's input and prevention from adding duplicate values.

