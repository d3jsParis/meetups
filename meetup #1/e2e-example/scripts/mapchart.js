window.France = (function() {


  function Constructor (params) {
    //useful data
    this.data = _.clone(params.data);
    this.geoData = params.geoData;
    this.parent = params.parent;
    this.colors = params.colors;
    this.title = params.title;
    //display config
    this.width = params.width || 600;
    this.height = params.height || 400;
    this.duration = params.duration || 2000;
    this.factor = params.factor  || 0.4;

    this.group = params.group;
  }

  Constructor.prototype.init = function () {
    var self = this;


		// CREATE SVG CONTAINER
    this.container = this.parent.append('g')
      .attr('transform', 'matrix('+this.factor+',0,0,'+this.factor+',-110,-80)')
      .append('g');

		// CREATE SCALE
    this.quantile = d3.scale.quantile()
      .domain(_.values(_.pick(this.data[this.data.length - 1],this.group)))
      .range(d3.range(this.colors.length));

    this.cValue = this.data.length - 1;

		// FILL AREA WITH CORRESPONDING COLOR BASED ON DATA
    this.container.selectAll('.region')
       .data(this.geoData.regions)
       .enter().append('path')
       .attr('class', 'region')
       .attr('id', function (d) {return d.name;})
       .attr('fill', function (d) {return self.colors[self.quantile(self.data[self.cValue][d.name])];})
       .attr('d', function (d) {return d.path.split(' C')[0] ;})
       .on('mouseover', function (d) {self.emit('mapenter');})
       .on('mousemove', function (d) {
         var position = d3.mouse(this)
           , value = self.data[self.cValue][d.name];
         self.emit('maphover', { position: [position[0]*self.factor +50, position[1] * self.factor + 220 ]
                               , value: value
         });
         d3.select(this).attr('stroke', '#E80C7A');
         d3.select(this).attr('stroke-width', '3px');
       })
       .on('mouseout', function (d) {
         d3.select(this).attr('stroke', '#ffffff');
         d3.select(this).attr('stroke-width', '1px');
         self.emit('mapleave');
       });
    return this;
  };

  Constructor.prototype.show = function () {
		// TRANSITION + DELAY POUR AFFICHAGE
    this.container.selectAll('.region')
      .transition()
      .delay(function(d,i) {return 30*i;})
      .attr('d', function (d) {return d.path ;});

    return this;
  };

  Constructor.prototype.addLegend = function () {
    var self = this
      , quantiles = this.quantile.quantiles();

    var groups = quantiles.map(function (d,i) {
      if (i === 0) {
        return '< à ' + d.toFixed(1) + '%';
      } else {
        return 'de ' + quantiles[i-1].toFixed(1)+ ' à ' + d.toFixed(1) + '%';
      }
    });
    groups.push('> à ' + quantiles[quantiles.length-1].toFixed(1) + '%');

    var legend = this.container.selectAll('.legend')
      .data(groups.slice());

    legend.enter().append('g')
        .style('pointer-events', 'none')
        .attr('class', 'legend')
        .attr('transform', function(d, i) { return 'translate(30,' + (250 +i * 40) + ')'; })
        .append('rect');

    legend.append('rect')
        .attr('x', this.width - 28)
        .attr('width', 18 / this.factor)
        .attr('height', 18 / this.factor)
        .style('fill', function (d,i) {return self.colors[i];});

    legend.append('text')
        .attr('x', self.width - 34)
        .attr('y', 9/this.factor)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .style('font-size', '24px')
        .text(function(d) { return d; });

    legend.exit().remove();
  };

  Constructor.prototype.update = function (value) {
    var self = this;
    this.cValue = value;
    this.quantile.domain(_.values(_.pick(this.data[value],this.group)));
    this.container.selectAll('path')
      .attr('fill', function (d) {return self.colors[self.quantile(self.data[value][d.name])];});
    this.container.selectAll('.legend').remove();
    this.addLegend();
    return this;
  };

  jQuery.extend(Constructor.prototype, jQuery.eventEmitter);
  return Constructor;

}());
