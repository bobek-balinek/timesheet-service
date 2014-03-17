/**
 * Payslip module spec
 */

var _ = require('underscore');
var moment = require('moment');
var payslip = require('../lib/payslip');

describe("A payslip module", function() {

  it("contains relevant methods", function() {
    expect(payslip).toBeDefined();
    expect(payslip.generate).toBeDefined();
    expect(payslip.calculateTotalHours).toBeDefined();
    expect(payslip.calculateGrossTotal).toBeDefined();
    expect(payslip.calculateNetTotal).toBeDefined();
    expect(payslip.calculateTax).toBeDefined();
    expect(payslip.getUserData).toBeDefined();
  });

  it('calculates tax', function(){
    var sum = 1200;
    var tax_rate = 0.2;
    // 1200 * 0.2 = 240

    expect(payslip.calculateTax(sum, tax_rate)).toBe(240);
  });

  it('calculates gross total', function(){
    var hours = 150;
    var hourly_rate = 12.75;

    expect(payslip.calculateGrossTotal(hours, hourly_rate)).toBe(1912.5);
  });

  it('calculates net total', function(){
    var hours = 150;
    var hourly_rate = 12.75;
    var tax_rate = 0.2;
    var grossTotal = hours * hourly_rate;
    // (150 * 12.75) - ((150 * 12.75) * 0.2)

    expect(payslip.calculateNetTotal(grossTotal, tax_rate)).toBe(1530);
  });

  it('calculates total number of hours from a data collection', function(){
    var data = [{
      hours: 7.5
    },{
      hours: 4.5
    },{
      hours: 9.25
    },{
      hours: 3.5
    },{
      hours: 12.0
    },{
      hours: 1.0
    }]; // Total of 37.75

    expect(payslip.calculateTotalHours(data)).toBe(37.75);
  });

  /** For sample data look into data.json file **/
  it('should retrieve a data blob with user details', function(done){
    var employee_id = 1;

    payslip.getUserData(employee_id, function(data){
      expect(data.number).toBe(employee_id);
      done();
    });
  });

  /** For sample data look into data.json file **/
  it('generates a data blob to render a payslip', function(done){
    var employee_id = 1;
    var date_from = '2014-03-01';
    var date_to = '2014-03-31';

    payslip.generate(employee_id, date_from, date_to, function(data){
      expect(parseFloat(data.total_hours)).toBe(21.0); // This value will change if you change the data.json file
      done();
    });
  });

});
