const SI_select = document.getElementById("SI");
const CI_select = document.getElementById("CI");
let amount ;
var RoI;
var time;
var loanTakenDate;
var loanTakenDate_date;
var loanTakenDate_month;
var loanTakenDate_year;
var loanRepaidDate;
var loanRepaidDate_date;
var loanRepaidDate_month;
var loanRepaidDate_year;
var interestAmount_title; 
var totalAmount_title;
var interestPerMonth;
var interestAmount;
var totalAmount;

document.getElementById("simpleInterest").onclick = function(event){
    event.preventDefault();
    SI_select.checked = true;

    // Set the background color of the clicked button to aqua
    this.style.backgroundColor = "aqua";
    
    // Uncheck the previously selected button if any
    document.getElementById("compoundInterest").style.backgroundColor = "";
    
    const months_input = document.getElementById("timeType");
    months_input.innerText = "No. of Months";
}

document.getElementById("compoundInterest").onclick = function(event){
    event.preventDefault();
    CI_select.checked = true;

    // Set the background color of the clicked button to aqua
    this.style.backgroundColor = "aqua";
    
    // Uncheck the previously selected button if any
    document.getElementById("simpleInterest").style.backgroundColor = "";
    
    const years_input = document.getElementById("timeType");
    years_input.innerText = "No. of Years";
}


//clear warning for time
function clearWarning() {
    document.getElementById("warning").innerText = "";
}
const elementsToWatch = ["Months", "loanTakenDate", "loanRepaidDate"];
elementsToWatch.forEach(id => {
    document.getElementById(id).onclick = clearWarning;
});


//date input
function dateInput_check(loanTakenDate,loanRepaidDate){ 

    let loanTakenDate_validity = document.getElementById("loanTakenDate_validity");
    let loanRepaidDate_validity = document.getElementById("loanRepaidDate_validity");   
    
    // Clear previous error messages
    loanTakenDate_validity.innerText = "";
    loanRepaidDate_validity.innerText = "";
    
    if(loanTakenDate && loanRepaidDate){ 
        
        const loanTakenDate_arr = loanTakenDate.split('-');
        loanTakenDate_year = parseInt(loanTakenDate_arr[0]);
        loanTakenDate_month = parseInt(loanTakenDate_arr[1]);
        loanTakenDate_date = parseInt(loanTakenDate_arr[2]);

        const loanRepaidDate_arr = loanRepaidDate.split('-');
        loanRepaidDate_year = parseInt(loanRepaidDate_arr[0]);
        loanRepaidDate_month = parseInt(loanRepaidDate_arr[1]);
        loanRepaidDate_date = parseInt(loanRepaidDate_arr[2]);

        const loanTakenDate_obj = new Date(loanTakenDate);
        const loanRepaidDate_obj = new Date(loanRepaidDate);

        if(loanRepaidDate_obj < loanTakenDate_obj) {
            loanRepaidDate_validity.innerText = "Loan repayment cannot be done befor it's taken";
            return false;
        }
        return true;
    }
    else if(loanTakenDate && !loanRepaidDate){
        loanRepaidDate_validity.innerText = "Please enter the Loan Repaid Date";
        return false;
    }
    else if(!loanTakenDate && loanRepaidDate){
        loanTakenDate_validity.innerText = "Please enter the Loan taken Date";
        return false;
    }
    else{
        return false;
    }
}


//Days in a month
function getDaysInMonth(month,year){
    return new Date(year, month, 0).getDate();
}

//Interest per month
function getPerMonthInterest(amount,RoI){
    let perMonthInterest = (amount*RoI)/100;
    return perMonthInterest;
}

//case1 (same year, same month, given date is less than repaid data)
function case1(d1,d2,pI,daysInMonth){
    var inte = ((d2-d1)*pI)/daysInMonth;
    return inte;
}

//case2 (same year, given month is less than repaid month, given date is less than repaid data)
function case2(d1,d2,m1,m2,pI,daysInMonth){
    var inte = ((m2-m1)*pI) + case1(d1,d2,pI,daysInMonth);
    return inte;
}

//case3 (same year, given month is less than repaid month, given date is greater than repaid data)
function case3(d1,d2,m1,m2,pI,daysInMonth){
    var inte = ((m2-m1)*pI) - case1(d2,d1,pI,daysInMonth);
    return inte;
}

//case4 (given year is less than repaid year, given month is less than repaid month, given date is less than repaid data)
function case4(d1,d2,m1,m2,y1,y2,pI,daysInMonth){
    var inte = (((y2-y1)*12)*pI) + case2(d1,d2,m1,m2,pI,daysInMonth);
    return inte;
}

//case5 (given year is less than repaid year, given month is less than repaid month, given date is greater than repaid data)
function case5(d1,d2,m1,m2,y1,y2,pI,daysInMonth){
    var inte = (((y2-y1)*12)*pI) + case3(d1,d2,m1,m2,pI,daysInMonth);
    return inte;
}

//case6 (given year is less than repaid year, given month is greater than repaid month, given date is greater than repaid data)
function case6(d1,d2,m1,m2,y1,y2,pI,daysInMonth){
    var inte = (((y2-y1)*12)*pI) - case3(d2,d1,m2,m1,pI,daysInMonth);
    return inte;
}

//case7 (given year is less than repaid year, given month is greater than repaid month, given date is less than repaid data)
function case7(d1,d2,m1,m2,y1,y2,pI,daysInMonth){
    var inte = (((y2-y1)*12)*pI) - case2(d2,d1,m2,m1,pI,daysInMonth);
    return inte;
}


//Interest Cal
function getInterestAmount(interestPerMonth){
    let d1 = loanTakenDate_date;
    let d2 = loanRepaidDate_date;

    let m1 = loanTakenDate_month;
    let m2 = loanRepaidDate_month;

    let y1 = loanTakenDate_year;
    let y2= loanRepaidDate_year;

    var pI = interestPerMonth;

    var daysInMonth = getDaysInMonth(m2,y2);

    if(y1==y2){
        if(m1==m2){
            return case1(d1,d2,pI,daysInMonth);
        }
        else{
            if(d1<=d2){
                return case2(d1,d2,m1,m2,pI,daysInMonth);
            }
            else if(d1>d2){
                return case3(d1,d2,m1,m2,pI,daysInMonth);
            }
        }
    }
    else{
        if(m1<=m2){
            if(d1<=d2){
                return case4(d1,d2,m1,m2,y1,y2,pI,daysInMonth);
            }
            else{
                return case5(d1,d2,m1,m2,y1,y2,pI,daysInMonth);
            }
        }
        else{
            if(d1<=d2){
                return case6(d1,d2,m1,m2,y1,y2,pI,daysInMonth);
            }
            else{
                return case7(d1,d2,m1,m2,y1,y2,pI,daysInMonth);
            }
        }
    }
}

//CI 
function CI_getTotalAmount(amount,RoI){

    let d1 = loanTakenDate_date;
    let d2 = loanRepaidDate_date;

    let m1 = loanTakenDate_month;
    let m2 = loanRepaidDate_month;

    let y1 = loanTakenDate_year;
    let y2= loanRepaidDate_year;

    var pI = getPerMonthInterest(amount,RoI);

    while(y1!=y2){
        amount += (12*pI);
        y1++;
        if(y1==y2) break;
        pI = getPerMonthInterest(amount,RoI);
    }

    var daysInMonth = getDaysInMonth(m2,y2);
    if(m1<=m2){
        pI = getPerMonthInterest(amount,RoI);
        if(d1<=d2){
            amount += case2(d1,d2,m1,m2,pI,daysInMonth);
            return amount;
        }
        else{
            amount += case3(d1,d2,m1,m2,pI,daysInMonth);
            return amount;
        }
    }
    else if(m1>m2){
        if(d1<=d2){
            amount -= case3(d2,d1,m2,m1,pI,daysInMonth);
            return amount;
        }
        else{
            amount -= case2(d2,d1,m2,m1,pI,daysInMonth);
            return amount;
        }
    }
    
}


//after clicking submit
document.getElementById("calculate").onclick = function(event){
    event.preventDefault();

    const amount_input = document.getElementById("Amount");
    const RoI_input = document.getElementById("RoI");

    amount = parseFloat(amount_input.value);
    RoI = parseFloat(RoI_input.value);

    const time_input = document.getElementById("Months");

    time = parseFloat(time_input.value);

    const loanTakenDate_input = document.getElementById("loanTakenDate");
    const loanRepaidDate_input = document.getElementById("loanRepaidDate");

    loanTakenDate = loanTakenDate_input.value;
    loanRepaidDate = loanRepaidDate_input.value;

    interestAmount_title = document.getElementById("interestAmount");
    totalAmount_title = document.getElementById("totalAmount");

    if(CI_select.checked == true){
        if(dateInput_check(loanTakenDate,loanRepaidDate)==true && !time){
            totalAmount = CI_getTotalAmount(amount,RoI); 
        }
        else if(time){
            totalAmount = amount*(Math.pow((1+(RoI/(100*12))),(12*time)));
        }
        else{
            document.getElementById("warning").innerText = "Please enter any one of the below fields";
        }
        interestAmount = totalAmount - amount;
    }

    else{
        if(dateInput_check(loanTakenDate,loanRepaidDate)==true && !time){
            interestPerMonth = getPerMonthInterest(amount,RoI);
            interestAmount = getInterestAmount(interestPerMonth);
        }
        else if(time){
            interestAmount = (amount*RoI*time)/100;
        }
        else{
            document.getElementById("warning").innerText = "Please enter any one of the below fields";
        }
        totalAmount = amount + interestAmount;
    }
    interestAmount_title.textContent = `Interest Amount: ${interestAmount.toFixed(2)}`;
    totalAmount_title.textContent = `Total Amount: ${totalAmount.toFixed(2)}`;
}
