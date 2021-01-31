var scalesParseTime = d3.timeParse("%d/%m/%Y %H:%M:%S");
var tf = d3.timeFormat('%d %b %Y')

var margin = {'top': 200}
var w, h

var date280 = new Date('7 November 2017')

let viewport = d3.select('#landscape').select('g')

windowResized = function() {
    // w = window.innerWidth
    // h = window.innerHeight

    w = d3.select('svg').node().clientWidth
    // h = d3.select('svg').node().clientHeight
    h = w
    d3.select('svg').style('height', h)


    xs = d3.scaleTime().domain([scalesParseTime("11/10/2012 00:00:00").getTime(), Date.now()]).range([0, w])
    ys = d3.scaleLinear().domain([40, 80]).range([h, margin.top])

    // fn = d3.area()
    //     .y0(d=>ys(d['Weight kg']))
    //     .x0(d=>{ return xs(scalesParseTime(d['Date']).getTime()) })
    //     .y1(d=>ys(40))
    //     .curve(d3.curveCatmullRom)
    
    fn_w = d3.area()
        // .y0(d=>ys(d['Weight kg']-(d['Fat %']*d['Weight kg']/100.0)))
        // .y0(d=>ys(d['Weight kg']-(d['Fat %'])))
        .y0(h)

        .x0(d=>{ return xs(scalesParseTime(d['Date']).getTime()) })
        .y1(d=>ys(d['Weight kg']))
        .curve(d3.curveCatmullRom)
}

loadData = function() {
    d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vRLUBo-PM3Qsh_JH0rloZozDUFQJn8x4zZOI5R_Qm-_qz5zVDZ2AmPKGlTEoZnYJkPBccFpGg4ImDs7/pub?gid=2&single=true&output=csv').then(data=>{
            scales = data
            // viewport.on('mousemove', function(e) {
            //     d3.select('#big-date').text(tf(xs.invert(d3.event.x)))
            // })

            // landscapeRender()
        // })

        d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vTylGf2sPc5uFiAsXnCR6QarCBu73yJiJ32_uvV3Z0JvB-FauMhsEx53N2ttBImf6VSnxb7-CMVLXg2/pub?gid=0&single=true&output=csv').then( data=>{
            twd = data
            let parseTime = d3.timeParse('%B %d, %Y at %I:%M%p')
            twd.forEach(element => {
                element.date = parseTime(element.datetime) 
                //    element.r = element.text.length/10.0
                element.r = Math.sqrt(element.text.length)*0.7
                element.x = xs(element.date)
                element.y = Math.random() * h
            });
            landscapeRender()

            // callBirds()
            // plantTrees()
        })
    })
    }

highlandMin = function() {
    return ys(Math.min(...scales.map(s=>+s['Weight kg'])))
}

lowlandMin = function() {

    if(typeof scales == "undefined") return
    return ys(Math.min(...scales.map(d=>ys(d['Weight kg']-(d['Fat %'])))))
}

landscapeRender = function() {
    viewport.selectAll('*').remove()

    viewport.append('rect').style('fill', 'url(#sky-grad)')
        .attr('x', 0).attr('width', w).attr('y', 0)
        .attr('height', ys(Math.min(...scales.map(s=>+s['Weight kg'])))) 

    viewport.append('path').attr('d', fn_w(scales)).style('fill', 'url(#red-grad)').style('stroke', 'black').style('stroke-width', '0.5')

    plantTrees()
    // viewport.append('path').attr('d', fn(scales)).style('fill', 'url(#red-grad)')//.style('stroke', 'black')//.style('stroke-width', '0.5')

}
            
plantTrees = function() {
    const isReply = function(d) {
        return d.text.startsWith('@')
    }

    treePath = d3.symbol().type(d3.symbolTriangle).size(100)()

    trees = viewport.selectAll('.tree')
        .data(twd)
        .enter()
        .append('path')
        .attr('y', Math.random() * h)

        // .attr('x', d=>{ return xs(d.date) })
        .attr('x', d=>{ return xs(d.date)})

        .attr('class', 'tree')
        .attr('d', d=>d3.symbol().type(d3.symbolTriangle).size(d.text.length)())
        
        // .style('fill', d=>d.text.startsWith('@') ? 'rgba(255, 255, 255, 0.4)': 'rgba(255, 255, 255, 1.0)')
        .style('fill', d=>d.text.startsWith('@') ? 'rgba(68, 73, 75, 0.4)': 'rgba(68, 73, 75, 1.0)')

        .style('stroke', '#ddd')
        .style('stroke-width', '0')
        .on('mouseover', function(d) {
            d3.select('#tweet-text').text(d.text)
                .transition().duration(400)
                .style('opacity', 1.0)
            d3.select(this).raise().style('stroke-width', '2')

            d3.select('#tweet-text').on('click', _ => {
                window.open(d.url)
            })
        })
        .on('mouseout', function(d) {
            d3.select('#tweet-text').transition().delay(600).duration(500).style('opacity', 0)//.style('top', h + 'px')
            d3.select(this).style('stroke-width', '0')//.style('z-index', 0)
        })

        trees.raise()

        treeline = lowlandMin()

    simulation = d3.forceSimulation(twd)
        .velocityDecay(0.15)
        .force("x", d3.forceX(d=>{ return xs(d.date) }).strength(0.5))
        .force("y", d3.forceY(highlandMin() * 1.5).strength(d => isReply(d) ? 0.2 : 0.5))
        .force("collide", d3.forceCollide().radius(10).iterations(2))
        .force("charge", d3.forceManyBody().strength(_=>{return -1.0 - Math.random()*5}))
        .on("tick", function() {
            d3.selectAll('.tree').attr('transform', d=>`translate(${d.x}, ${d.y})`)
        })
        .tick(150)
}    

callBirds = function() {
        const isReply = function(d) {
            return d.text.startsWith('@')
        }

        birds = viewport.selectAll('.bird')
            .data(twd)
            .enter()
            .append('circle')
            .attr('cy', Math.random() * h)

            // .attr('x', d=>{ return xs(d.date) })
            .attr('cx', d=>{ return xs(d.date)})

            // .attr('r', 3)
            // .attr('r', d=>d.text.length/60.0)
            .attr('r', d=>d.r)
            .attr('class', 'bird')

            .style('fill', d=>d.text.startsWith('@') ? 'rgba(255, 255, 255, 0.4)': 'rgba(255, 255, 255, 1.0)')
            .style('stroke', '#999')
            .style('stroke-width', '0')
            .on('mouseover', function(d) {
                d3.select('#tweet-text').text(d.text)
                    .transition().duration(1000)
                    .style('top', '200px')
                // d3.selectAll('.bird').style('z-index', e=> e == d ? 2: -1)
                d3.select(this).raise().style('stroke-width', '2')

                d3.select('#tweet-text').on('click', _ => {
                    window.open(d.url)
                })
            })
            .on('mouseout', function(d) {
                d3.select('#tweet-text').transition().delay(600).duration(500).style('top', h + 'px')
                d3.select(this).style('stroke-width', '0')//.style('z-index', 0)
            })

        simulation = d3.forceSimulation(twd)
            .velocityDecay(0.9)
            .force("x", d3.forceX(d=>{ return xs(d.date) }).strength(0.5))
            .force("y", d3.forceY().y(100).strength(d => isReply(d) ? 0.02 : 0.1))
            // .force("collide", d3.forceCollide().radius(d => d.r + 0).iterations(2))
            .force("charge", d3.forceManyBody().strength(-10))
            .on("tick", function() {
                d3.selectAll('.bird').attr('cx', d=>d.x).attr('cy', d=>d.y)
            })
            .tick(120)
        }
    
windowResized()
window.onresize = function() { windowResized(); landscapeRender() }
loadData()