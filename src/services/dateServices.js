import moment from 'moment';

/**
 * Custom function to parse dates; convert from string to moment object
 * @param {*} input 
 */
export const dateStrToMoment = (input) => {
    return moment.utc(input, "YYYY-MM-DD"); 
  };

/**
 * Custom function to parse dates; convert from string to javascript object
 * @param {*} input 
 */
export const dateStrToJSDate = (input) => {
    let jsDate = moment.utc(input, "YYYY-MM-DD").toDate();
    return jsDate.setHours(0,0,0,0)
  };


/** 
 * Custom function that takes in an array, checks the startDate property of each 
 * element in the array and return the earliest date as a moment object
*/
export const getEarliestDate = (tasksArray) => {
    let earliestDate = tasksArray[0].startDate;

    if (tasksArray.length > 1) {
        for (let i = 1; i < tasksArray.length; i++) {
            if ((dateStrToMoment(tasksArray[i].startDate)).isBefore(dateStrToMoment(earliestDate))) {
                earliestDate = tasksArray[i].startDate
            };
        };
    };
    
    return dateStrToMoment(earliestDate);

};

/** 
 * Custom function that takes in an array, checks the endDate property of each 
 * element in the array and return the latest date as a moment object
*/
export const getLatestDate = (tasksArray) => {
    let latestDate = tasksArray[0].endDate;

    if (tasksArray.length > 1) {
        for (let i = 1; i < tasksArray.length; i++) {
            if ((dateStrToMoment(tasksArray[i].endDate)).isAfter(dateStrToMoment(latestDate))) {
                latestDate = tasksArray[i].endDate;
            };
        };
    }

    return dateStrToMoment(latestDate);

};