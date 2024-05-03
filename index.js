console.log("hello")
const realDate = $("#real_date")
const btn1 = $("#btn-1");
const date = new Date()


$(realDate).text(date.toDateString())

btn1.on("click", e => {
    $("#hid")[0].setAttribute("data-hidden", false)
    getData()
})
const getData = async () => {
    let response = await fetch("http://localhost:5000", { method: "GET" });
    response = await response.json()
    let table = $("#table")
    response.forEach(shop => {
        shop.forEach((medicine, index) => {
            let cost = Object.values(medicine)[1]
            let key = Object.keys(medicine)[0]

            let tr = document.createElement("tr")
            tr.innerHTML += `<td>${key}</td>\n
            <td>Rs.${cost}</td>\n
            <td><input type='number' class='amount' value=6></td>
            `
            table.append(tr)
        })
    })
    const days = $("#days")
    days.on("change", e => {
        $("#btn3")[0].innerText = `Calculate for next ${days.val()} days`
    })
    $("#btn3").on("click", async e => {
        $("#hid1")[0].setAttribute("data-hidden", false)
        let data = []
        $(".amount").each((index, ele) => {
            data.push(ele.value)
        })
        let newData = new URLSearchParams({ d: data, days: days.val() })
        let response = await fetch("http://localhost:5000/getList", { method: "POST", body: newData })
        response = await response.json()
        let sum = 0;
        const tab = $("#res")[0]
        response.forEach(ele => {
            let tr = document.createElement("tr")
            tr.innerHTML = `<td>${ele.name}</td>\n
            <td>${ele.needed}</td>\n
            <td>Rs.${ele.price}</td>\n
            `
            tab.append(tr)
            sum += ele.price
        })
        const d = new Date()
        d.setDate(d.getDate() + 30)
        $("#cost").text(`Total cost Rs. ${sum}`)
        $("#last").text(`Last Date: ${d.toDateString()}`)
    })
}
