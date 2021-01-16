var scalesParseTime = d3.timeParse("%d/%m/%Y %H:%M:%S");
var w = 2000
var h = 1000
var xs = d3.scaleTime().domain([scalesParseTime("11/10/2012 00:00:00").getTime(), Date.now()]).range([0, w])
var margin = {'top': 200}


d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vRLUBo-PM3Qsh_JH0rloZozDUFQJn8x4zZOI5R_Qm-_qz5zVDZ2AmPKGlTEoZnYJkPBccFpGg4ImDs7/pub?gid=2&single=true&output=csv').then(w=>{
        console.log(w)

        d3.select("#g").style('height', h + margin.top).style('width', w)

        let ys = d3.scaleLinear().domain([40, 80]).range([h, margin.top])
        
        let fn = d3.area()
        .y0(d=>ys(d['Weight kg']))
        .x0(d=>{ return xs(scalesParseTime(d['Date']).getTime()) })
        .y1(d=>ys(40))
        .curve(d3.curveCatmullRom)

        d3.select('#g').append('path').attr('d', fn(w))   

        let fn_w = d3.area()
            .y0(d=>ys(d['Weight kg']-(d['Fat %']*d['Weight kg']/100.0)))
            .x0(d=>{ return xs(scalesParseTime(d['Date']).getTime()) })
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
            .attr('cx', xs(scalesParseTime(d['Date']).getTime()))
            .attr("r", 6)
        }
        // w.push({'Weight kg':60, 'Date': d3.timeFormat("%d/%m/%Y %H:%M:%S")(Date.now()), 'Fat %':0})
        // w.push({'Weight kg':60, 'Date': w[0]['Date'], 'Fat %':0})
        // w.push({'Weight kg':w[0]['Weight kg'], 'Date': w[0]['Date'], 'Fat %':0})
        // callBirds()
    })

    d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vTylGf2sPc5uFiAsXnCR6QarCBu73yJiJ32_uvV3Z0JvB-FauMhsEx53N2ttBImf6VSnxb7-CMVLXg2/pub?gid=0&single=true&output=csv').then( data=>{
        console.log(data)
        twd = data
    })
 

    callBirds = function() {
            let parseTime = d3.timeParse('%B %d, %Y at %I:%M%p')
        
            birds = d3.select('#g').selectAll('.bird')
                .data(twd)
                .enter()
                .append('circle')
                // .attr('cy', d=>d.text.length + 350)
                .attr('cy', d=>Math.random()*255 + 350)
                .attr('cy', 150)


                // .attr('cx', d=>xs(parseTime(d.datetime))-w)
                .attr('cx', 50)

                .attr('r', 3)
                .attr('r', d=>d.text.length/60.0)
                .attr('class', 'bird')
                .style('fill', d=>d.text.startsWith('@') ? 'transparent': 'black')
                .style('stroke', 'black')
                .style('stroke-width', '1')


            delay = 5.0
            duration = 1000.0
            birds // fly in
                .transition()
                .duration((_,i)=>duration + Math.random()*500)
                // .delay((d,i)=>delay / d.text.length - i)
                // .delay((d,i)=>delay * (twd.length - i))
                .delay((d,i)=>delay * i)

                .attr('cx', d=>{
                    return xs(parseTime(d.datetime))
                })

                
                .attr('cy', d=>d.text.length + 350)
                .style('fill', d=>d.text.startsWith('@') ? 'transparent': '#fff')
                .style('stroke', '#555')
                .style('stroke-width', '1').attr('r', d=>d.text.length/25.0).style('opacity', d=>(d.text.length+55)/200.0)
    }