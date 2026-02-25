# Decisions

## 1. Task Assignment

The following tasks were assigned to the members present at the meeting:

* **Setting up the GitHub project** — **Margarida Cardoso (125799)** — *Team Manager*
* **Refining user stories** — **Tiago Costa (125943)** — *Product Owner*
* **Writing the meeting minutes** — **Daniel Martins (115868)** — *DevOps Master*

---

## 2. System Entities

We concluded that the entities in our system will be:


* **Maintenance Technician**
  A person responsible for performing maintenance on machines when issues occur.

* **Maintenance Director**
  A person responsible for assigning machines to maintenance technicians.

* **Analyst**
  Has access to statistics and data regarding machine status, failures, and system performance.

* **Administrator**
  The highest-ranking role in the company. Has access to all system data and all users.

* **Regular User**
  A standard user of the system. All user roles inherit from this entity.

* **Machine**
  A company machine that may require maintenance.

* **Issue**
  Describes a defect or malfunction in a machine.

* **Failure Manager**
  An intelligent system component responsible for detecting machine failures.

* **Maintenance**
  A record of the process of assigning a maintenance technician to repair a faulty machine.
  It can be:

  * **Normal Maintenance**
  * **Special Maintenance**

* **Request**
  A signal sent from a technician to the Maintenance Director when additional resources are required.
