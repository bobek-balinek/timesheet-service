/**
 * Time-sheet module spec
 */
var storage = require('../lib/storage');
var timesheet = require('../lib/timesheet');

describe("A timesheet module", function() {

  it("contains relevant methods", function() {
    expect(timesheet).toBeDefined();
    expect(timesheet.addJob).toBeDefined();
    expect(timesheet.getJobs).toBeDefined();
    expect(timesheet.findJob).toBeDefined();
  });

  it("retrieves a list of jobs", function(done){
    var date = '2014-03-16';

    timesheet.getJobs(1, date, function(obj){
      expect(obj).toBeDefined();
      expect(obj).not.toEqual([]);
      done();
    });
  });

  it("find a given job", function(done){
    var employee_id = 1;
    var date = '2014-03-16';
    var job_number = '873000';

    timesheet.findJob(employee_id, job_number, date, function(obj){
      expect(obj).toBeDefined();
      expect(obj.job_number).toBe(job_number);
      done();
    });
  });

  it("adds a new job to the list", function(done){
    var employee_id = 8;
    var date = '2014-03-16';
    var job_number = "8787";

    var sampleData = {
      "date": date,
      "number": job_number,
      "description": "Flash banner",
      "hours": 2.5
    };

    timesheet.addJob(employee_id, sampleData, function(results){
      expect(results).toBeDefined();

      // Test if it is stored
      timesheet.findJob(employee_id, job_number, date, function(obj){
        // console.log(obj);
        expect(obj).toBeDefined();
        expect(obj.job_number).toBe(job_number);
        done();
      });

    });
  });

});
