window.France = (function() {


  function Constructor (params) {
    //useful data
    //this.data = _.clone(params.data);
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

    this.container = this.parent.append('g')
      .attr('transform', 'matrix('+this.factor+',0,0,'+this.factor+',-110,-80)')
      .append('g');

    this.container.selectAll('.region')
       .data(this.geoData.regions)
       .enter().append('path')
       .attr('class', 'region')
       .attr('id', function (d) {return d.name;})
       .attr('fill', function (d,i) {return 'rgb('+4*i +','+(250-3*i)+','+(100+2*i)+')';})
       .attr('d', function (d) {return d.path.split(' C')[0] ;})
    return this;
  };

  Constructor.prototype.show = function () {
    this.container.selectAll('.region')
      .transition()
      .delay(function(d,i) {return 30*i;})
      .attr('d', function (d) {return d.path ;});

    return this;
  };


  jQuery.extend(Constructor.prototype, jQuery.eventEmitter);
  return Constructor;

}());
