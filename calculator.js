(function () {
    const tabRideBtn = document.getElementById('tabRideBtn');
    const tabRentalBtn = document.getElementById('tabRentalBtn');
    const tabRide = document.getElementById('tab-ride');
    const tabRental = document.getElementById('tab-rental');

    function showTab(name) {
        const rideActive = name === 'ride';
        tabRideBtn.classList.toggle('active', rideActive);
        tabRentalBtn.classList.toggle('active', !rideActive);
        tabRide.classList.toggle('active', rideActive);
        tabRental.classList.toggle('active', !rideActive);
    }

    tabRideBtn.addEventListener('click', () => showTab('ride'));
    tabRentalBtn.addEventListener('click', () => showTab('rental'));
})();

(function () {
    const fareInput = document.getElementById('fare');
    const dailyTargetInput = document.getElementById('dailyTarget');
    const dailyKmInput = document.getElementById('dailyKmInput');
    const myLocationInput = document.getElementById('myLocation');
    const pickupInput = document.getElementById('pickup');
    const customerFareInput = document.getElementById('customerFare');
    const averageInput = document.getElementById('average');
    const fuelRateInput = document.getElementById('fuelRate');
    const commissionInput = document.getElementById('commission');
    const workingDaysInput = document.getElementById('workingDays');

    const modeChips = document.querySelectorAll('#modeChips .mode-chip');
    const dailyTargetGroup = document.getElementById('dailyTargetGroup');
    const dailyKmGroup = document.getElementById('dailyKmGroup');
    const myLocationGroup = document.getElementById('myLocationGroup');
    const pickupGroup = document.getElementById('pickupGroup');
    const customerFareGroup = document.getElementById('customerFareGroup');
    const fareGroup = document.getElementById('fareGroup');
    const averageGroup = document.getElementById('averageGroup');
    const workingDaysGroup = document.getElementById('workingDaysGroup');
    const row1 = document.getElementById('row1');
    const row2 = document.getElementById('row2');

    const resultBoxMain = document.getElementById('resultBoxMain');
    const resultBoxRideFare = document.getElementById('resultBoxRideFare');
    const footerNoteMain = document.getElementById('footerNoteMain');
    const footerNoteRideFare = document.getElementById('footerNoteRideFare');

    const dailyKmLabel = document.getElementById('dailyKmLabel');
    const dailyKmDisplay = document.getElementById('dailyKm');
    const dailyGrossDisplay = document.getElementById('dailyGross');
    const dailyProfitDisplay = document.getElementById('dailyProfit');
    const monthlyGrossDisplay = document.getElementById('monthlyGross');
    const monthlyFuelDisplay = document.getElementById('monthlyFuel');
    const monthlyCommissionDisplay = document.getElementById('monthlyCommission');
    const monthlyProfitDisplay = document.getElementById('monthlyProfit');
    const daysLabel = document.getElementById('daysLabel');

    const rideExpectedFareDisplay = document.getElementById('rideExpectedFare');
    const rideFarePerKmDisplay = document.getElementById('rideFarePerKm');
    const rideFuelCostDisplay = document.getElementById('rideFuelCost');
    const rideCommissionDisplay = document.getElementById('rideCommission');
    const rideProfitDisplay = document.getElementById('rideProfit');

    let mode = 'target';

    function fmt(n) {
        const sign = n < 0 ? '-Rs. ' : 'Rs. ';
        return sign + Math.round(Math.abs(n)).toLocaleString();
    }

    function resetDisplay(workingDays, message) {
        dailyKmDisplay.textContent = '— km';
        dailyGrossDisplay.textContent = 'Rs. —';
        dailyProfitDisplay.textContent = 'Rs. —';
        dailyProfitDisplay.classList.remove('red');
        dailyProfitDisplay.classList.add('gold');
        monthlyGrossDisplay.textContent = 'Rs. —';
        monthlyFuelDisplay.textContent = 'Rs. —';
        monthlyCommissionDisplay.textContent = 'Rs. —';
        monthlyProfitDisplay.textContent = message || 'Rs. —';
        monthlyProfitDisplay.classList.remove('red');
        monthlyProfitDisplay.classList.add('gold');
        daysLabel.textContent = workingDays;
    }

    function resetRideFareDisplay() {
        rideExpectedFareDisplay.textContent = 'Rs. —';
        rideFarePerKmDisplay.textContent = 'Rs. —';
        rideFuelCostDisplay.textContent = 'Rs. —';
        rideCommissionDisplay.textContent = 'Rs. —';
        rideProfitDisplay.textContent = 'Rs. —';
        rideProfitDisplay.classList.remove('red');
        rideProfitDisplay.classList.add('gold');
    }

    function setMode(newMode) {
        mode = newMode;

        dailyTargetGroup.style.display = mode === 'target' ? 'block' : 'none';
        dailyKmGroup.style.display = mode === 'km' ? 'block' : 'none';
        myLocationGroup.style.display = mode === 'ridefare' ? 'block' : 'none';
        pickupGroup.style.display = mode === 'ridefare' ? 'block' : 'none';
        customerFareGroup.style.display = mode === 'ridefare' ? 'block' : 'none';
        fareGroup.style.display = mode === 'ridefare' ? 'none' : 'block';
        workingDaysGroup.style.display = mode === 'ridefare' ? 'none' : 'block';

        if (mode === 'ridefare') {
            row2.insertBefore(averageGroup, row2.firstChild);
            commissionInput.value = '12';
        } else {
            row1.appendChild(averageGroup);
            commissionInput.value = '0';
        }

        resultBoxMain.style.display = mode === 'ridefare' ? 'none' : 'block';
        resultBoxRideFare.style.display = mode === 'ridefare' ? 'block' : 'none';
        footerNoteMain.style.display = mode === 'ridefare' ? 'none' : 'block';
        footerNoteRideFare.style.display = mode === 'ridefare' ? 'block' : 'none';

        calculate();
    }

    function calculateRideFare() {
        const myLocationKm = parseFloat(myLocationInput.value) || 0;
        const pickupKm = parseFloat(pickupInput.value) || 0;
        const km = myLocationKm + pickupKm;
        const farePrice = parseFloat(customerFareInput.value) || 0;
        const standardRate = parseFloat(fareInput.value) || 0;
        const avg = parseFloat(averageInput.value) || 0;
        const fuelRate = parseFloat(fuelRateInput.value) || 0;
        const commissionPct = parseFloat(commissionInput.value) || 0;

        if (km <= 0 || avg <= 0 || fuelRate <= 0) {
            resetRideFareDisplay();
            return;
        }

        const expectedFare = standardRate * km;
        const fuelCost = (km / avg) * fuelRate;
        const commissionAmt = farePrice * (commissionPct / 100);
        const netProfit = farePrice - fuelCost - commissionAmt;
        const perKmFare = farePrice / km;

        rideExpectedFareDisplay.textContent = fmt(expectedFare);
        rideFarePerKmDisplay.textContent = 'Rs. ' + perKmFare.toFixed(2) + '/km';
        rideFuelCostDisplay.textContent = fmt(fuelCost);
        rideCommissionDisplay.textContent = fmt(commissionAmt);
        rideProfitDisplay.textContent = fmt(netProfit);

        if (netProfit < 0) {
            rideProfitDisplay.classList.remove('gold');
            rideProfitDisplay.classList.add('red');
        } else {
            rideProfitDisplay.classList.remove('red');
            rideProfitDisplay.classList.add('gold');
        }
    }

    function calculate() {
        if (mode === 'ridefare') {
            calculateRideFare();
            return;
        }

        const fare = parseFloat(fareInput.value) || 0;
        const avg = parseFloat(averageInput.value) || 0;
        const fuelRate = parseFloat(fuelRateInput.value) || 0;
        const commissionPct = parseFloat(commissionInput.value) || 0;
        const workingDays = parseInt(workingDaysInput.value) || 26;

        if (fare <= 0 || avg <= 0 || fuelRate <= 0 || workingDays <= 0) {
            resetDisplay(workingDays);
            return;
        }

        const fuelCostPerKm = fuelRate / avg;
        const commissionPerKm = fare * (commissionPct / 100);
        const totalCostPerKm = fuelCostPerKm + commissionPerKm;
        const netProfitPerKm = fare - totalCostPerKm;

        let dailyKm;

        if (mode === 'target') {
            const dailyTarget = parseFloat(dailyTargetInput.value) || 0;
            if (dailyTarget <= 0) { resetDisplay(workingDays); return; }
            if (netProfitPerKm <= 0) { resetDisplay(workingDays, 'Fare too low!'); return; }
            dailyKm = dailyTarget / netProfitPerKm;
            dailyKmLabel.textContent = 'Daily Required Distance';
        } else {
            dailyKm = parseFloat(dailyKmInput.value) || 0;
            if (dailyKm <= 0) { resetDisplay(workingDays); return; }
            dailyKmLabel.textContent = 'Daily Distance (Set)';
        }

        const dailyGrossEarning = dailyKm * fare;
        const dailyFuelCost = dailyKm * fuelCostPerKm;
        const dailyCommission = dailyKm * commissionPerKm;
        const dailyNetProfit = dailyGrossEarning - dailyFuelCost - dailyCommission;

        const monthlyGrossEarning = dailyGrossEarning * workingDays;
        const monthlyFuelCost = dailyFuelCost * workingDays;
        const monthlyCommission = dailyCommission * workingDays;
        const monthlyNetProfit = dailyNetProfit * workingDays;

        dailyKmDisplay.textContent = dailyKm.toFixed(0) + ' km';
        dailyGrossDisplay.textContent = fmt(dailyGrossEarning);
        dailyProfitDisplay.textContent = fmt(dailyNetProfit);
        if (dailyNetProfit < 0) {
            dailyProfitDisplay.classList.remove('gold');
            dailyProfitDisplay.classList.add('red');
        } else {
            dailyProfitDisplay.classList.remove('red');
            dailyProfitDisplay.classList.add('gold');
        }
        monthlyGrossDisplay.textContent = fmt(monthlyGrossEarning);
        monthlyFuelDisplay.textContent = fmt(monthlyFuelCost);
        monthlyCommissionDisplay.textContent = fmt(monthlyCommission);
        monthlyProfitDisplay.textContent = fmt(monthlyNetProfit);
        daysLabel.textContent = workingDays;

        if (monthlyNetProfit < 0) {
            monthlyProfitDisplay.classList.remove('gold');
            monthlyProfitDisplay.classList.add('red');
        } else {
            monthlyProfitDisplay.classList.remove('red');
            monthlyProfitDisplay.classList.add('gold');
        }
    }

    modeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            modeChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            setMode(chip.dataset.mode);
        });
    });

    const inputs = [fareInput, dailyTargetInput, dailyKmInput, myLocationInput, pickupInput, customerFareInput, averageInput, fuelRateInput, commissionInput, workingDaysInput];
    inputs.forEach(inp => {
        inp.addEventListener('input', calculate);
        inp.addEventListener('change', calculate);
    });

    setMode('ridefare');
})();

(function () {
    const rentInput = document.getElementById('rentPerCar');
    const startCarsInput = document.getElementById('startCars');
    const priceInput = document.getElementById('carPrice');
    const targetInput = document.getElementById('targetCars');
    const taxInput = document.getElementById('taxRate');
    const applyTaxCheckbox = document.getElementById('applyTax');
    const tableBody = document.getElementById('tableBody');
    const statsPanel = document.getElementById('statsPanel');
    const warningDiv = document.getElementById('warningMessage');

    function formatMoney(num) {
        const sign = num < 0 ? '-' : '';
        num = Math.abs(num);
        if (num >= 1e9) {
            return sign + (num / 1e9).toFixed(2) + ' Arab';
        } else if (num >= 1e7) {
            return sign + (num / 1e7).toFixed(2) + ' Crore';
        } else if (num >= 1e5) {
            return sign + (num / 1e5).toFixed(2) + ' Lac';
        }
        return sign + Math.round(num).toLocaleString();
    }

    function formatTime(totalMonths) {
        if (totalMonths < 0) return "0y 0m";
        let years = Math.floor(totalMonths / 12);
        let months = Math.floor(totalMonths % 12);
        return `${years}y ${months}m`;
    }

    function getDateFromMonths(cumulativeMonths) {
        let totalMonths = cumulativeMonths;
        let yearsOffset = Math.floor(totalMonths / 12);
        let monthIndex = Math.floor(totalMonths % 12);
        let year = 2027 + yearsOffset;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthName = monthNames[monthIndex];
        return { month: monthName, year: year };
    }

    function calculateGrowth() {
        let rent = parseFloat(rentInput.value);
        let startCars = parseInt(startCarsInput.value);
        let carPrice = parseFloat(priceInput.value);
        let targetCars = parseInt(targetInput.value);
        let taxRate = parseFloat(taxInput.value);
        const applyTax = applyTaxCheckbox.checked;

        if (isNaN(rent) || rent <= 0) rent = 75000;
        if (isNaN(startCars) || startCars < 1) startCars = 2;
        if (isNaN(carPrice) || carPrice <= 0) carPrice = 2450000;
        if (isNaN(targetCars) || targetCars < 1) targetCars = 100;
        if (isNaN(taxRate) || taxRate < 0) taxRate = 29;
        if (taxRate > 100) taxRate = 100;

        const netFactor = applyTax ? (1 - taxRate / 100) : 1;

        if (targetCars > 2000) {
            warningDiv.style.display = 'block';
            warningDiv.innerHTML = `You set target to ${targetCars.toLocaleString()} cars. This may take a moment to calculate and display. The calculator will work but might be slow. Consider lowering for better performance.`;
        } else if (targetCars > 800) {
            warningDiv.style.display = 'block';
            warningDiv.innerHTML = `Target: ${targetCars.toLocaleString()} cars. Calculation in progress...`;
        } else {
            warningDiv.style.display = 'none';
        }

        let rows = [];
        let cumulativeMonths = 0;
        let currentCars = startCars;
        let currentProfit = currentCars * rent * netFactor;

        for (let i = 1; i <= currentCars && i <= targetCars; i++) {
            rows.push({
                carNumber: i,
                month: "Jan",
                year: 2027,
                totalCars: i,
                profit: i * rent * netFactor,
                monthsToGet: 0,
                cumulativeMonths: 0,
                timeString: "Start (Jan 2027)",
                isOwned: true
            });
        }

        if (targetCars <= currentCars) {
            return { rows: rows.slice(0, targetCars), finalMonths: 0, finalProfit: currentProfit };
        }

        let nextCar = currentCars + 1;
        let workingProfit = currentProfit;
        let workingCumulative = cumulativeMonths;
        let workingFleet = currentCars;

        while (nextCar <= targetCars) {
            let monthsNeeded = carPrice / workingProfit;
            workingCumulative = workingCumulative + monthsNeeded;

            const { month, year } = getDateFromMonths(workingCumulative);

            workingFleet = nextCar;
            workingProfit = workingFleet * rent * netFactor;

            rows.push({
                carNumber: nextCar,
                month: month,
                year: year,
                totalCars: workingFleet,
                profit: workingProfit,
                monthsToGet: monthsNeeded,
                cumulativeMonths: workingCumulative,
                timeString: formatTime(workingCumulative),
                isOwned: false
            });

            nextCar++;

            if (workingProfit <= 0) break;
        }

        let finalProfit = workingProfit;
        let finalCumulative = workingCumulative;

        return { rows: rows, finalMonths: finalCumulative, finalProfit: finalProfit };
    }

    function renderTable() {
        const result = calculateGrowth();
        const rows = result.rows;
        const targetValue = parseInt(targetInput.value) || 100;

        tableBody.innerHTML = '';

        const profitColHeader = document.getElementById('profitColHeader');
        profitColHeader.textContent = applyTaxCheckbox.checked
            ? `Monthly Profit After Tax (PKR)`
            : `Monthly Profit (PKR)`;

        if (rows.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No data to display</td></tr>';
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const tr = document.createElement('tr');

            if (row.isOwned) {
                tr.classList.add('owned-row');
            }

            if (row.carNumber === targetValue) {
                tr.classList.add('target-row');
            }

            const td1 = document.createElement('td'); td1.textContent = row.carNumber;
            const td2 = document.createElement('td'); td2.textContent = row.month;
            const td3 = document.createElement('td'); td3.textContent = row.year;
            const td4 = document.createElement('td'); td4.textContent = row.totalCars;
            const td5 = document.createElement('td'); td5.textContent = formatMoney(row.profit);
            const td6 = document.createElement('td'); td6.textContent = row.monthsToGet.toFixed(2);
            const td7 = document.createElement('td'); td7.textContent = row.cumulativeMonths.toFixed(1);
            const td8 = document.createElement('td'); td8.textContent = row.timeString;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            tr.appendChild(td7);
            tr.appendChild(td8);

            tableBody.appendChild(tr);
        }

        const startCarsVal = parseInt(startCarsInput.value) || 2;
        const rentVal = parseFloat(rentInput.value) || 75000;
        const targetVal = targetValue;
        const taxOn = applyTaxCheckbox.checked;
        const taxRateVal = parseFloat(taxInput.value) || 29;
        const netFactorVal = taxOn ? (1 - taxRateVal / 100) : 1;
        const startProfit = startCarsVal * rentVal * netFactorVal;
        const targetProfit = result.finalProfit;
        const timeToTarget = result.finalMonths;
        const profitLabel = taxOn ? `Revenue (After ${taxRateVal}% Tax)` : 'Revenue (Before Tax)';

        statsPanel.innerHTML = `
            <div class="stat-card">
                <div class="label">Target: ${targetVal.toLocaleString()} Cars</div>
                <div class="value">${formatMoney(targetProfit)} PKR/mo</div>
            </div>
            <div class="stat-card">
                <div class="label">Time to Reach Target</div>
                <div class="value">${formatTime(timeToTarget)}</div>
            </div>
            <div class="stat-card">
                <div class="label">Starting Fleet (${startCarsVal} cars)</div>
                <div class="value">${formatMoney(startProfit)} PKR/mo</div>
            </div>
            <div class="stat-card">
                <div class="label">Monthly ROI per Car</div>
                <div class="value">${((rentVal / (parseFloat(priceInput.value) || 2450000)) * 100).toFixed(2)}%</div>
            </div>
            <div class="stat-card">
                <div class="label">${profitLabel}</div>
                <div class="value" style="font-size:1rem;">${taxOn ? taxRateVal + '% deducted' : 'No tax deducted'}</div>
            </div>
        `;
    }

    function exportToCSV() {
        const result = calculateGrowth();
        const rows = result.rows;

        if (rows.length === 0) {
            alert("No data to export");
            return;
        }

        const taxOn = applyTaxCheckbox.checked;
        const taxRateVal = parseFloat(taxInput.value) || 29;

        const profitHeader = taxOn ? `Monthly Profit After ${taxRateVal}% Tax (PKR)` : "Monthly Profit Before Tax (PKR)";
        const headers = ["Car Number", "Purchase Month", "Purchase Year", "Total Cars", profitHeader, "Months to Get This Car", "Cumulative Months", "Time from Start"];

        const csvRows = [headers.join(',')];

        for (const row of rows) {
            const csvRow = [
                row.carNumber,
                row.month,
                row.year,
                row.totalCars,
                Math.round(row.profit),
                row.monthsToGet.toFixed(2),
                row.cumulativeMonths.toFixed(2),
                row.timeString
            ].map(cell => `"${cell}"`).join(',');
            csvRows.push(csvRow);
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `car_growth_${parseInt(targetInput.value)}_cars${taxOn ? '_after_tax' : ''}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    rentInput.addEventListener('input', renderTable);
    startCarsInput.addEventListener('input', renderTable);
    priceInput.addEventListener('input', renderTable);
    targetInput.addEventListener('input', renderTable);
    taxInput.addEventListener('input', renderTable);
    applyTaxCheckbox.addEventListener('change', renderTable);
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);

    renderTable();
})();
