// Grid logic

var GridLayout = (function() {

  var GridLayout = function(columns, rows) {
    this._counter = 0;
    this.columns = columns;
    this.rows = rows;
    this._cells = {};
  };

  var p = GridLayout.prototype;

  p.getElementId = function(el) {
    return el.dataset.gridId;
  };

  p.insert = function(el, rect) {

    var isNew = false;
    var id = this.getElementId(el);

    if(!id) {
      isNew = true;
      id = this._registerElement(el);
    }

    if(rect && Number.isInteger(rect.top) && Number.isInteger(rect.left)) {
      if(!isNew) {
        var currentRect = this.getElementRect(el);
        this._unfill(currentRect);
      }
      this._free(rect, [id]);
      this._fill(id, rect);
    } else {
      var pos = this._getInsertionPoint(
        rect.width || 1,
        rect.height || 1
      );

      this._fill(id, {
        top: pos.row,
        left: pos.column,
        width: rect.width || 1,
        height: rect.height || 1
      });
    }

  };

  p.resize = function(id, toWidth, toHeight) {

    var rect = this.getElementRect(id);

    this._free({
      top: rect.top,
      left: rect.left,
      width: toWidth,
      height: toHeight
    }, [id]);

    this._unfill(rect);

    this._fill(id, {
      top: rect.top,
      left: rect.left,
      width: toWidth,
      height: toHeight
    });

  };

  p.move = function(id, toRow, toCol) {

    var rect = this.getElementRect(id);
    var dest = {
      top: toRow,
      left: toCol,
      width: rect.width,
      height: rect.height
    };

    this._unfill(rect);
    this._free(dest);
    this._fill(id, dest);

  };

  p.compact = function() {

    var self = this;
    var elements = this.getElements();

    elements.forEach(function(id) {

      var rect = self.getElementRect(id);
      var dest = {
        top: rect.top-1,
        left: rect.left,
        width: rect.width,
        height: 1
      };
      var isAvailable = self._isSpaceAvailable(dest);

      while(isAvailable) {
        dest.top--;
        isAvailable = self._isSpaceAvailable(dest);
        if(!isAvailable) {
          self._unfill(rect);
          self._fill(id, {
            top: dest.top+1,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
        }
      };

    });

  };

  p.getElementSize = function(id) {

    var size = {width: 0, height: 0};
    var pos = this.getElementPosition(id);
    var row = pos.top;
    var column = pos.left;

    if(!pos) {
      return {width: 1, height: 1};
    }

    while(!size.height) {
      if(id !== this._getElementInCell(row, pos.left)) {
        size.height = row-pos.top;
      }
      row++;
    }

    while(!size.width) {
      if(id !== this._getElementInCell(pos.top, column)) {
        size.width = column-pos.left;
      }
      column++;
    }

    return size;

  };

  p.getElementPosition = function(id) {

    if(typeof id !== 'string') {
      id = this.getElementId(id);
    }

    var current;

    for(var top = 0, rows = this.rows; top < rows; ++top) {
      for(var left = 0, columns = this.columns; left < columns; ++left) {
        current =  this._getElementInCell(top, left);
        if(current === id) {
          return {top: top, left: left};
        }
      }
    }

  };

  p.getElementRect = function(id) {

    if(typeof id !== 'string') {
      id = this.getElementId(id);
    }

    var size = this.getElementSize(id);
    var pos = this.getElementPosition(id);

    return {
      top: pos.top,
      left: pos.left,
      width: size.width,
      height: size.height
    };

  };

  p.getElements = function() {

    var cells = this._cells;

    return Object.keys(cells).reduce(function(arr, cellId) {

      var id = cells[cellId];
      if(arr.indexOf(id) === -1) {
        arr.push(id);
      }

      return arr;

    }, []);

  };

  /* Private methods */

  p._getElementInCell = function(row, column) {
    return this._cells[row + '-' + column];
  };

  p._getElementsInRect = function(rect) {

    var id;
    var elements = [];

    for(var column = rect.left; column < rect.left+rect.width; ++column) {
      for(var row = rect.top; row < rect.top+rect.height; ++row) {
        id = this._getElementInCell(row, column);
        if(id && elements.indexOf(id) === -1) {
          elements.push(id);
        }
        id = null;
      }
    }

    return elements;

  };

  p._isFilled = function(row, column) {
    return (row + '-' + column) in this._cells;
  };

  p._fill = function(id, rect) {
    for(var column = rect.left; column < rect.left+rect.width; ++column) {
      for(var row = rect.top; row < rect.top+rect.height; ++row) {
        this._cells[row + '-' + column] = id;
      }
    }
  };

  p._unfill = function(rect) {
    for(var column = rect.left; column < rect.left+rect.width; ++column) {
      for(var row = rect.top; row < rect.top+rect.height; ++row) {
        delete this._cells[row + '-' + column];
      }
    }
  };

  p._isSpaceAvailable = function(rect) {

    if(rect.top < 0 || rect.left < 0) {
      return false;
    }

    for(var column = rect.left; column < rect.left+rect.width; ++column) {
      for(var row = rect.top; row < rect.top+rect.height; ++row) {
        if(column > this.columns || this._isFilled(row, column)) {
          return false;
        }
      }
    }

    return true;

  };

  p._free = function(rect, ignore) {

    ignore = ignore || [];

    var self = this;
    var collisions = this._getElementsInRect(rect);

    collisions.forEach(function(id) {
      if(ignore.indexOf(id) === -1) {
        self._moveDown(id, rect.top + rect.height);
      }
    });

  };

  p._getInsertionPoint = function(width, height) {

    var isAvailable;
    var dest = {
      top: 0,
      left: 0,
      width: width,
      height: height
    };

    for(dest.top = 0; dest.top < this.rows; ++dest.top) {
      for(dest.left = 0; dest.left < this.columns; ++dest.left) {
        isAvailable = this._isSpaceAvailable(dest);
        if(isAvailable) {
          return {column: dest.left, row: dest.top};
        }
      }
    }

  };

  p._moveDown = function(id, toRow) {

    var self = this;
    var rect = self.getElementRect(id);

    self._unfill(rect);

    this._free({
      top: toRow,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }, [id]);

    this._fill(id, {
      top: toRow,
      left: rect.left,
      width: rect.width,
      height: rect.height
    });

  };

  p._registerElement = function(element) {

    var id = 'grid_' + this._counter++;

    element.dataset.gridId = id;

    return id;

  };

  return GridLayout;

}());