var Cell = {
    initialize: function(cellId) {
        this.cellId = cellId;
        this.state = false;
        this.futureState = false;

    },

    create: function(cellId, dimension) {
        var cell = Object.create(Cell);
        cell.initialize(cellId);
        cell.setNeighbors(cellId, dimension)
        return cell;
    },


    wrapWorld: function(neighbors, dimension) {
       for (var index = 0; index < neighbors.length; ++ index) {
            if(neighbors[index] < 1) {
                neighbors[index] += (dimension * dimension)
            } else if(neighbors[index] > (dimension * dimension)) {
                neighbors[index] -= (dimension * dimension)
            } else {
                neighbors[index] = neighbors[index]
            }
        }
       this.neighbors = neighbors
    },

    setNeighbors: function(cellId, dimension) {
        var neighbors = []
        var positions = [ -dimension, dimension, -1, 1, -(dimension -1), -(dimension +1), (dimension -1), (dimension + 1)]
        positions.forEach(function(position) {
            neighbors.push(cellId + position)
        })
        this.wrapWorld(neighbors, dimension)
    },

    liveNeighbors: function() {
        var live_count = 0
        for(var index = 0; index < this.neighbors.length; ++ index) {
            if(World.population[this.neighbors[index]-1].state === true ) {
                live_count += 1
            }
        }
        return live_count
    },

    setFutureState: function() {
        var alive = this.liveNeighbors();
         if (alive < 2 && this.state === true) {
          this.futureState = false;
        } else if ((alive === 2 || alive === 3) && this.state === true) {
          this.futureState = true;
        } else if (alive > 3 && this.state === true) {
          this.futureState = false;
        } else if (this.state === false && alive === 3) {
          this.futureState = true;
        } else {
          this.futureState = this.state;
        }
        return this.futureState;
    },

    setState: function() {
        this.state = !this.state
    }

};

var World = {
    population: [],
    populate: function(dimension) {
        for(var index = 0; index < (dimension * dimension); ++ index) {
            World.population.push(Cell.create((index +1 ), dimension))
        }
   }

};

$(document).ready(function() {
    World.populate(40);

    for (var i=0; i < 40; i++) {
        $("table#universe").append("<tr></tr>")
        for(var j=0; j < 40; j++ ) {
            $("tr").last().append("<td id ='" + ((i*40)+j) + "' class = 'dead'></td>")
        }
    }

    $('table#universe td').click(function() {
        var cellId = $(this).attr("id");
        World.population[cellId].setState();
        $(this).attr('class', 'alive');

    });

    $("button#start").click(function() {
        var interval = setInterval(function() {
            World.population.forEach(function(cell) {
                cell.setFutureState();
            });

            World.population.forEach(function(cell) {
                if (cell.futureState === true) {
                    $("td#"+cell.cellId).attr('class', 'alive')
                    cell.state = true
                    this.timeAliveCount += 1
                } else if (cell.futureState === false) {
                    $("td#"+cell.cellId).attr('class', 'dead')
                    cell.state = false
                }
           });

        }, 100);

        $("button#pause").click(function() {
            clearInterval(interval);
        });

        $("button#game-over").click(function() {
            clearInterval(interval);
            World.population = [];
            $("td").attr('class', 'dead')
            World.populate(40);

        });
    });




})


