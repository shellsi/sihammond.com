var parseTime = d3.timeParse("%d/%m/%Y");

d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vRLUBo-PM3Qsh_JH0rloZozDUFQJn8x4zZOI5R_Qm-_qz5zVDZ2AmPKGlTEoZnYJkPBccFpGg4ImDs7/pub?gid=2&single=true&output=csv').then(w=>{
    // console.log(w)
    let ys = d3.scaleLinear().domain([60, 80]).range([1000, 0])
    let xs = d3.scaleTime().domain([parseTime("11/10/2012").getTime(), Date.now()]).range([0, 2000])
    let fn = d3.area()
        .x(
            d=>{
                return xs(parseTime(d['Date']).getTime())
            }
        )
        .y(d=>ys(d['Weight kg']))
        .curve(d3.curveBasis);

    for(d of w){
        console.log(d)
        d3.select('#g').append('circle')
        .attr('cy', ys(d['Weight kg']))
        .attr('cx', xs(parseTime(d['Date']).getTime()))
        .attr('r', 6)
        // .on("mouseover", function(d) {
        //     console.log(d)
        // })
    }
    d3.select('#g').append('path').attr('d', fn(w))
})
