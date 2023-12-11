import React, { ChangeEvent, useState } from 'react';
import './DiscoveryDropDown.css';
// import hubbellLogo from './hubbell.png';
import maintenanceData from './maintenanceTasks.json';
import Collapsible from 'react-collapsible';
import moment from 'moment';

interface Task {
  equipment: string;
  description: string;
  tasks: {
    daily: string[];
    monthly: string[];
  };
}

const DiscoveryDropDown = () => {
  const [step, setStep] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState('Select Facility');
  const [selectedMachine, setSelectedMachine] = useState('');

  const machines = ['Focal #1', 'Focal #2', 'Focal #3'];

  const handleFacilityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFacility(e.target.value);
    setSelectedMachine('');
  };

  const handleNextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleMachineChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMachine(e.target.value);
  };

  const getTasksForSelectedMachine = () => {
    if (selectedFacility && selectedMachine) {
      const facilityData = maintenanceData[selectedFacility];
      if (facilityData) {
        const machineData = facilityData[selectedMachine];
        return Object.values(machineData);
      }
    }
    return [];
  };

  const selectedMachineTasks = getTasksForSelectedMachine();

  const renderTasks = (tasks: ArrayLike<unknown> | { [s: string]: unknown }) => {
    if (!tasks || typeof tasks !== 'object') {
      return null;
    }
    return (
      <div> 
        {Object.entries(tasks).map(([taskType, taskList]) => (
          <div key={taskType}>
            <table className='taskTable'>
                <thead>
                    <tr className="taskMainHead">
                      <th className='taskHead'><h4>{taskType}</h4></th>
                      <th><h4>Last completion date</h4></th>
                    </tr>
                </thead>
                <tbody>
                {(taskList as any).map((task: any, index: any) => (
                // <li key={index}>{index}.{task}</li>
                  <tr className='taskRow' key={index}>
                    <td className='taskContent'><span>{index+1}.&nbsp;&nbsp;</span><span>{task.task}</span></td>
                    <td className='taskCompletedDate'>{(taskType=="Daily")?moment().subtract(1,'d').format("LL"):moment(task.lastCompletedDate).format("LL")}</td>
                  </tr>
                ))}
    
                </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  const renderCollapsibleTrigger = (label: string) => (
    <div className="collapsible-trigger">
      {label}
      <button className="collapsible-button">&#x25BC;</button> {/* Downward caret */}
    </div>
  );

  return (
    <div className="DiscoveryDropDown">
      <div className="tear-sheet">
        {/* <div className="header-container">
          <img src={hubbellLogo} alt="Hubbell Logo" className="hubbell-logo" />
          <h1>Preventative Maintenance</h1>
        </div> */}
        {step === 1 && (
          <div className="step">
            <h4>Step 1: Select a Facility</h4>
            <select value={selectedFacility} onChange={handleFacilityChange}>
              <option value="">Select Facility</option>
              <option value="Lincoln">Lincoln</option>
            </select>

            <h4>Step 2: Choose a Machine</h4>
            <select value={selectedMachine} onChange={handleMachineChange}>
              <option value="">Select Machine</option>
              {machines.map(machine => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>

            <button onClick={handleNextStep}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <p>
              <label className="facility_label">Selected Facility:</label> {selectedFacility}
            </p>
            <p>
              <label className="machine_label">Selected Machine:</label> {selectedMachine}
            </p>
            <div className="renderTaskList">
              {(selectedMachineTasks as Task[]).map((section: Task, index: number) => (
                <Collapsible
                  key={index}
                  trigger={renderCollapsibleTrigger(`Equipment: ${section.equipment}`)}
                >
                  {renderTasks(section.tasks)}
                </Collapsible>
              ))}
            </div>
            <button onClick={handlePreviousStep}>Back</button>
          </div>
        )}

        {/* {step === 2 && (
          <div className="step">
            <p>Selected Facility: {selectedFacility}</p>
            <p>Selected Machine: {selectedMachine}</p>
            <div>
              {selectedMachineTasks.map((section) => (
                <div key={section.equipment}>
                  <h3>{section.equipment}</h3>
                  {Object.entries(section.tasks).map(([taskType, taskList]) => (
                    <div key={taskType}>
                      <h4>{taskType}</h4>
                      <ul>
                        {taskList.map((task, index) => (
                          <li key={index}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button onClick={handlePreviousStep}>Back</button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export { DiscoveryDropDown };
