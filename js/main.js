var parseTime = d3.timeParse("%d/%m/%Y %H:%M:%S");

d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vRLUBo-PM3Qsh_JH0rloZozDUFQJn8x4zZOI5R_Qm-_qz5zVDZ2AmPKGlTEoZnYJkPBccFpGg4ImDs7/pub?gid=2&single=true&output=csv').then(w=>{
    console.log(w)
    let ys = d3.scaleLinear().domain([40, 80]).range([1000, 0])
    let xs = d3.scaleTime().domain([parseTime("11/10/2012 00:00:00").getTime(), Date.now()]).range([0, 2000])
    
    let fn = d3.area()
    .y0(d=>ys(d['Weight kg']))
    .x0(d=>{ return xs(parseTime(d['Date']).getTime()) })
    .y1(d=>ys(40))
    .curve(d3.curveCatmullRom)

    d3.select('#g').append('path').attr('d', fn(w))   

    let fn_w = d3.area()
        .y0(d=>ys(d['Weight kg']-(d['Fat %']*d['Weight kg']/100.0)))
        .x0(d=>{ return xs(parseTime(d['Date']).getTime()) })
        .y1(d=>ys(d['Weight kg']))
        .curve(d3.curveCatmullRom)

    d3.select('#g').append('path').attr('d', fn_w(w)).style('fill', 'grey')


    // let fn_m = d3.area()
    //     .y0(d=>ys(d['Weight kg']+(d['Muscle %']*d['Weight kg']/100.0)))
    //     .x0(d=>{ return xs(parseTime(d['Date']).getTime()) })
    //     .y1(d=>ys(d['Weight kg']))
    //     .curve(d3.curveCatmullRom);

    // d3.select('#g').append('path').attr('d', fn_m(w)).style('fill', 'red')

    for(d of w){
        // console.log(d)
        d3.select('#g').append('circle')
        .attr('cy', ys(d['Weight kg']))
        .attr('cx', xs(parseTime(d['Date']).getTime()))
        .attr("r", 6)
    }
    // w.push({'Weight kg':60, 'Date': d3.timeFormat("%d/%m/%Y %H:%M:%S")(Date.now()), 'Fat %':0})
    // w.push({'Weight kg':60, 'Date': w[0]['Date'], 'Fat %':0})
    // w.push({'Weight kg':w[0]['Weight kg'], 'Date': w[0]['Date'], 'Fat %':0})


})
