Anacapa Jenkins Shared Library
==============================

The lifecycle of the Jenkins portion of Project Anacapa is as follows:

TODO: Write documentation on how to create initial `installAnacapa` job that generates the `AnacapaGrader/` folder and `AnacapaGrader/setupCourse` job

# INFO

This library utilizes the [Jenkins Job DSL Plugin](https://github.com/jenkinsci/job-dsl-plugin) in order to generate various Jenkins Jobs
needed for auto-grading for the [Anacapa System](https://github.com/project-anacapa).

Some Jenkins Dependencies:

- Jenkins itself
- This shared library
- [Job DSL Plugin](https://github.com/jenkinsci/job-dsl-plugin)
- [Folders Plugin](https://plugins.jenkins.io/cloudbees-folder)
- [GitHub Plugin](https://plugins.jenkins.io/github)
- [SSH Slaves Plugin](https://plugins.jenkins.io/ssh-slaves)
- [Copy Artifacts Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Copy+Artifact+Plugin)
- [Credentials Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Credentials+Plugin)
- [Workspace Cleanup Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Workspace+Cleanup+Plugin)

## AnacapaGrader/setupCourse

Source location: [jobs/setupCourse.groovy](jobs/setupCourse.groovy)

`AnacapaGrader/setupCourse` is automatically created whenever your `installAnacapa` job is run.

This job is used to set up a folder within Jenkins that will hold all the assignment/grader jobs for an individual course.
It will also create the job that will be used to generate new assignment/grader jobs.

When you run this job given parameters:
- `git_provider_domain` - your git provider (e.g. github.com, github.ucsb.edu, gitlab.com)
- `course_org` - the organization/group set up with your Anacapa website (e.g. `ucsb-cs99-s15`)
- `credentials_id` - credentials that can be used to check out repositories from the git repos under `course_org`

The following will be created/updated:

- __Folder__: AnacapaGrader/<git_provider_domain>/
  - e.g. AnacapaGrader/github.com
- __Folder__: AnacapaGrader/<git_provider_domain>/<course_org>/
  - e.g. AnacapaGrader/github.com/ucsb-cs99-s15
- __Job__: AnacapaGrader/<git_provider_domain>/<course_org>/setupAssignment
  - e.g. AnacapaGrader/github.com/ucsb-cs99-s15/setupAssignment


## AnacapaGrader/<git_provider_domain>/<course_org>/setupAssignment

Source location: [jobs/setupAssignment.groovy](jobs/setupAssignment.groovy)

This job is automatically created upon course creation via `AnacapaGrader/setupCourse`.

This job is used to generate new assignment/grader jobs.

When you run this job given parameters:
- `lab_name` - name of the lab to create (corresponding to an existing git repository named `assignment-${lab_name}`)

The following will be created/updated:
- __Job__: AnacapaGrader/<git_provider_domain>/<course_org>/assignment-<lab_name>
  - e.g. AnacapaGrader/github.com/ucsb-cs99-s15/assignment-lab01
- __Job__: AnacapaGrader/<git_provider_domain>/<course_org>/grader-<lab_name>
  - e.g. AnacapaGrader/github.com/ucsb-cs99-s15/grader-lab01


## AnacapaGrader/<git_provider_domain>/<course_org>/assignment-<lab_name>

Source location: [jobs/assignment.groovy](jobs/assignment.groovy) and [vars/runAssignment.groovy](vars/runAssignment.groovy)

This job is automatically created via `AnacapaGrader/<git_provider_domain>/<course_org>/setupAssignment`. It is used to
validate, verify, and obtain all information needed to grade the assignment.

The assignment job ***MUST*** be run first before the grader, as it verifies and validates the assignment master repository 
to make sure that grading will be able to properly function. Some notes:

- It will attempt to clone the assignment master repository at `https://<git_provider_domain>/<course_org>/assignment-<lab_name>.git` using the credentials provided when first firing the `AnacapaGrader/setupCourse` job.
- It will assume that your assignment master repository has at minimum the contents
  - .anacapa/
  - .anacapa/assignment_spec.json
- If this job runs successfully, then your assignment is properly set up/configured to be graded.
- When this job is successfully run, it stores the expected outputs as needed as "artifacts" on the Jenkins master server under this job. The grader job refers to these when running student code.


## AnacapaGrader/<git_provider_domain>/<course_org>/grader-<lab_name>

Source location: [jobs/grader.groovy](jobs/grader.groovy) and [vars/runGrader.groovy](vars/runGrader.groovy)

This job is automatically created via `AnacapaGrader/<git_provider_domain>/<course_org>/setupAssignment`. It is used to
fetch, compile, and run student code against the test cases defined by the assignment master and generate a grade.

As above: the assignment job ***MUST*** be run first before the grader!!

When you run this job given parameters:
- `github_user` - the github username(s) of the student(s), lexicographically ordered and separated by `-`

The following will happen:
- It will attempt to clone the assigment master as from above
  - It gets the `.anacapa/assignment_spec.json` and groups together the files (if present) in `.anacapa/test_data` and
    `.anacapa/build_data`, stashing them as `test_data`, and `build_data`, respectively
  - It will get all of the solution artifacts from the assignment master job and stash them as `expected_outputs`
  - After parsing and stashing those files, it clears the workspace.
- It will attempt to clone the student repository at `https://<git_provider_domain>/<course_org>/<lab_name>-<github_user>.git` using the credentials provided when first firing the `AnacapaGrader/setupCourse` job.
- For each testable defined in the `assignment_spec.json`, it will:
  - Unstash the `build_data`, run the `build_command` command, and then remove the `build_data` from the workspace
  - Stash the current state of the workspace (program is compiled) as the testable name (e.g. `testable-name`)
  - Clear the workspace
  - For each test case in the testable, it will:
    - unstash `test_name` in the fresh workspace
    - unstash `test_data`
    - run the test's run command and save the output
    - remove the `test_data` folder
    - unstash `expected_outputs`
    - diff student code output with corresponding file from `expected_outputs`
      - if exit code is not 0, then the student receives a 0 for this test case and the diff output is saved as an artifact
      - if no difference, student receives full credit for this test case
    - save the score for this testable/test-case for later
    - clear the workspace
- After running all testable test groups, it will accumulate all of the intermediate scores into the final score output
- The final score is saved as an artifact of this job in json format.
