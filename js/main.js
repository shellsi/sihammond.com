var scalesParseTime = d3.timeParse("%d/%m/%Y %H:%M:%S");
var w = 2000
var h = 1000
var xs = d3.scaleTime().domain([scalesParseTime("11/10/2012 00:00:00").getTime(), Date.now()]).range([0, w])
var margin = {'top': 200}
var date280 = new Date('7 November 2017')


d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vRLUBo-PM3Qsh_JH0rloZozDUFQJn8x4zZOI5R_Qm-_qz5zVDZ2AmPKGlTEoZnYJkPBccFpGg4ImDs7/pub?gid=2&single=true&output=csv').then(w=>{
        console.log(w)

        d3.select("#landscape").style('height', h + margin.top).style('width', w)

        let ys = d3.scaleLinear().domain([40, 80]).range([h, margin.top])
        
        let fn = d3.area()
        .y0(d=>ys(d['Weight kg']))
        .x0(d=>{ return xs(scalesParseTime(d['Date']).getTime()) })
        .y1(d=>ys(40))
        .curve(d3.curveCatmullRom)

        d3.select('#landscape').append('path').attr('d', fn(w))   

        let fn_w = d3.area()
            .y0(d=>ys(d['Weight kg']-(d['Fat %']*d['Weight kg']/100.0)))
            .x0(d=>{ return xs(scalesParseTime(d['Date']).getTime()) })
            .y1(d=>ys(d['Weight kg']))
            .curve(d3.curveCatmullRom)

        d3.select('#landscape').append('path').attr('d', fn_w(w)).style('fill', 'grey')

        d3.select('#landscape').on('mousemove', function(e) {
            tf = d3.timeFormat('%d %b %Y')
        d3.select('#big-date').text(tf(xs.invert(d3.event.x)))

            // console.log(e)
        })

        // let fn_m = d3.area()
        //     .y0(d=>ys(d['Weight kg']+(d['Muscle %']*d['Weight kg']/100.0)))
        //     .x0(d=>{ return xs(parseTime(d['Date']).getTime()) })
        //     .y1(d=>ys(d['Weight kg']))
        //     .curve(d3.curveCatmullRom);

        // d3.select('#g').append('path').attr('d', fn_m(w)).style('fill', 'red')

        // for(d of w){
        //     // console.log(d)
        //     d3.select('#g').append('circle')
        //     .attr('cy', ys(d['Weight kg']))
        //     .attr('cx', xs(scalesParseTime(d['Date']).getTime()))
        //     .attr("r", 6)
        // }
        // w.push({'Weight kg':60, 'Date': d3.timeFormat("%d/%m/%Y %H:%M:%S")(Date.now()), 'Fat %':0})
        // w.push({'Weight kg':60, 'Date': w[0]['Date'], 'Fat %':0})
        // w.push({'Weight kg':w[0]['Weight kg'], 'Date': w[0]['Date'], 'Fat %':0})
    })

    d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vTylGf2sPc5uFiAsXnCR6QarCBu73yJiJ32_uvV3Z0JvB-FauMhsEx53N2ttBImf6VSnxb7-CMVLXg2/pub?gid=0&single=true&output=csv').then( data=>{
        twd = data
        let parseTime = d3.timeParse('%B %d, %Y at %I:%M%p')
        twd.forEach(element => {
           element.date = parseTime(element.datetime) 
        //    element.r = element.text.length/10.0
           element.r = Math.sqrt(element.text.length)
           element.x = xs(element.date)
           element.y = -50
        });
        callBirds()

    })
 
    callBirds = function() {

            const isReply = function(d) {
                return d.text.startsWith('@')
            }

            birds = d3.select('#landscape').selectAll('.bird')
                .data(twd)
                .enter()
                .append('circle')
                .attr('cy', -100)


                // .attr('x', d=>{ return xs(d.date) })
                .attr('cx', d=>{ return d.x })

                // .attr('r', 3)
                // .attr('r', d=>d.text.length/60.0)
                .attr('r', d=>d.r)
                .attr('class', 'bird')

                .style('fill', d=>d.text.startsWith('@') ? 'rgba(255, 255, 255, 0.4)': 'rgba(255, 255, 255, 1.0)')
                .style('stroke', '#999')
                .style('stroke-width', '0')
                .on('mouseover', function(d) {
                    d3.select('#tweet-text').text(d.text + d.date).transition().duration(1000)
                        .style('top', '200px')
                    // d3.selectAll('.bird').style('z-index', e=> e == d ? 2: -1)
                    d3.select(this).raise().style('stroke-width', '2')
                })
                .on('mouseout', function(d) {
                    d3.select('#tweet-text').transition().delay(600).duration(500).style('top', '-300px')
                    d3.select(this).style('stroke-width', '0')//.style('z-index', 0)
                })
                .on('click', d => {
                    window.open(d.url)
                })

            simulation = d3.forceSimulation(twd)
                .velocityDecay(0.05)
                .force("x", d3.forceX(d=>{ return xs(d.date) }))
                .force("y", d3.forceY().y(100).strength(d => isReply(d) ? 0.02 : 0.5))
                .force("collide", d3.forceCollide().radius(d => d.r + 0).iterations(2))
                .on("tick", function() {
                    d3.selectAll('.bird').attr('cx', d=>d.x).attr('cy', d=>d.y)
                })
                .tick(100)
                
          

            // delay = 2.0
            // duration = 1000.0
            // birds // fly in
            //     .transition()
            //     .duration((_,i)=>duration + Math.random()*500)
            //     // .delay((d,i)=>delay / d.text.length - i)
            //     // .delay((d,i)=>delay * (twd.length - i))
            //     .delay((d,i)=>delay * i)

            //     .attr('cx', d=>{
            //         return xs(d.date)
            //     })


                // .attr('cy', d=>d.text.length + 350)
                // .style('fill', d=>d.text.startsWith('@') ? 'transparent': '#fff')
                // .style('stroke', '#555')
                // .style('stroke-width', '1').attr('r', d=>d.text.length/25.0).style('opacity', d=>(d.text.length+55)/200.0)
    }