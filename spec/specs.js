beforeEach(function() {
    World.population = [];
});

describe('Cell', function() {
    describe('initialize',function() {
        it('sets the cells coordinates and states', function() {
            var testCell = Object.create(Cell);
            testCell.initialize(1);
            testCell.cellId.should.equal(1);
            testCell.state.should.equal(false);
            testCell.futureState.should.equal(false);
        });
    });
    describe('create', function() {
        it('sets the properties of the cell to the correct starting state', function() {
           var testCell = Cell.create(1,10);
           Cell.isPrototypeOf(testCell).should.equal(true);
        });
        it('sets the cells neighbors', function() {
            var testCell = Cell.create(25,10);
            testCell.neighbors.length.should.equal(8);
            testCell.neighbors.should.eql([15,35,24,26,16,14,34,36])
        });
        it('wraps neighbors when neighbors exist outside the worlds boundaries', function() {
            var testCell = Cell.create(5,10);
            testCell.neighbors.length.should.equal(8)
            testCell.neighbors.should.eql([95,15,4,6,96,94,14,16])
        })
    });
    describe('liveNeighbors', function() {
        it('returns the number of live neighbors ', function() {
            World.populate(10);
            var testCell = World.population[49];
            World.population[50].state = true;
            testCell.liveNeighbors().should.equal(1)
        })
    });
    describe('setFutureState', function() {
        it('returns false if a cell is alive and has less then two live neighbors', function() {
            World.populate(10);
            var testCell = World.population[50]
            testCell.state = true;
            testCell.setFutureState().should.equal(false)

        });
        it('returns true if a cell has two or three live neighbors and is alive', function() {
            World.populate(10);
            var testCell = World.population[49];
            World.population[59].state = true;
            World.population[39].state = true;
            testCell.state = true;
            testCell.setFutureState().should.equal(true)
        })
        it('returns false if a cell is alive and has more than three live neighbors', function() {
            World.populate(10);
            var testCell = World.population[49];
            World.population[59].state = true;
            World.population[39].state = true;
            World.population[50].state = true;
            World.population[48].state = true;
            testCell.state = true;
            testCell.setFutureState().should.equal(false)
        })
        it('returns true if a cell is dead and has exactly three live neighbors', function() {
            World.populate(10);
            var testCell = World.population[49];
            World.population[39].state = true;
            World.population[50].state = true;
            World.population[48].state = true;
            testCell.setFutureState().should.equal(true)

        })
    })

    describe('setState', function() {
        it('will change the state of a cell', function() {
            var testCell = Cell.create(4,10)
            testCell.setState();
            testCell.state.should.equal(true)
        })
    })
});

describe('World', function() {
    describe('populate', function() {
        it('populates a world with dimension squared cells', function() {
            World.populate(10);
            World.population.length.should.equal(100)
        })
    })
});
