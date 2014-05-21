// Grid logic

var GridLayout = (function() {

  var GridLayout = function(columns, rows) {
    this._counter = 0;
    this.columns = columns;
    this.rows = rows;
    this._cells = {};
  };

  var p = GridLayout.prototype;

  p.getElementInCell = function(row, column) {
    return this._cells[row + '-' + column];
  };

  p.getElementsInRect = function(top, left, width, height) {
    var elements = [];
    var id;
    for(var column = left; column < left+width; ++column) {
      for(var row = top; row < top+height; ++row) {
        id = this.getElementInCell(row, column);
        if(id && elements.indexOf(id) === -1) {
          elements.push(id);
        }
        id = null;
      }
    }
    return elements;
  };

  p.isFilled = function(row, column) {
    return (row + '-' + column) in this._cells;
  };

  p.fill = function(id, top, left, width, height) {
    for(var column = left; column < left+width; ++column) {
      for(var row = top; row < top+height; ++row) {
        this._cells[row + '-' + column] = id;
      }
    }
  };

  p.unfill = function(top, left, width, height) {
    width = width || 1;
    height = height || 1;
    for(var column = left; column < left+width; ++column) {
      for(var row = top; row < top+height; ++row) {
        delete this._cells[row + '-' + column];
      }
    }
  };

  p.isSpaceAvailable = function(top, left, width, height) {
    if(top < 0 || left < 0) {
      return false;
    }
    for(var column = left; column < left+width; ++column) {
      for(var row = top; row < top+height; ++row) {
        if(column > this.columns || this.isFilled(row, column)) {
          return false;
        }
      }
    }
    return true;
  };

  p.getAvailableInsertionPoint = function(width, height) {
    var isSpaceAvailable;
    for(var top = 0, rows = this.rows; top < rows; ++top) {
      for(var left = 0, columns = this.columns; left < columns; ++left) {
        isSpaceAvailable = this.isSpaceAvailable(top, left, width, height);
        if(isSpaceAvailable) {
          return {left: left, top: top};
        }
      }
    }
  };

  p.insert = function(element, rect) {
    var id = this.getElementId(element);
    if(!id) {
      id = this.registerElement(element);
    }
    if(rect && rect.top && rect.left) {
      this.fill(id, rect.top, rect.left, rect.width || 1, rect.height || 1);
    } else {
      var pos = this.getAvailableInsertionPoint(rect.width || 1, rect.height || 1);
      this.fill(id, pos.top, pos.left, rect.width || 1, rect.height || 1);
    }
  };

  p.resize = function(id, toWidth, toHeight) {
    var self = this;
    var rect = self.getElementRect(id);
    var collisions = self.getElementsInRect(rect.top, rect.left, toWidth, toHeight);
    collisions.forEach(function(collId) {
      if(id !== collId) {
        self.moveDown(collId, rect.top + toHeight);
      }
    });
    self.unfill(rect.top, rect.left, rect.width, rect.height);
    self.fill(id, rect.top, rect.left, toWidth, toHeight);
  };

  p.moveDown = function(id, toRow) {
    var self = this;
    var rect = self.getElementRect(id);
    self.unfill(rect.top, rect.left, rect.width, rect.height);
    var ids = this.getElementsInRect(toRow, rect.left, rect.width, rect.height);
    ids.forEach(function(id) {
      self.moveDown(id, toRow + rect.height);
    });
    this.fill(id, toRow, rect.left, rect.width, rect.height);
  };

  p.compact = function() {
    var self = this;
    var elements = this.getElements();
    elements.forEach(function(id) {
      var rect = self.getElementRect(id);
      var rowOffset = 1;
      var isSpaceAvailable = self.isSpaceAvailable(rect.top-rowOffset, rect.left, rect.width, 1);
      while(isSpaceAvailable) {
        rowOffset++;
        isSpaceAvailable = self.isSpaceAvailable(rect.top-rowOffset, rect.left, rect.width, 1);
        if(!isSpaceAvailable) {
          self.unfill(rect.top, rect.left, rect.width, rect.height);
          self.fill(id, rect.top-rowOffset+1, rect.left, rect.width, rect.height);
        }
      };
    });
  };

  p.getElementId = function(element) {
    return element.dataset.gridId;
  };

  p.registerElement = function(element) {
    var id = 'grid_' + this._counter++;
    element.dataset.gridId = id;
    return id;
  };

  p.getElementSize = function(id) {
    var pos = this.getElementPosition(id);
    if(!pos) {
      return {width: 1, height: 1};
    }
    var size = {width: 0, height: 0};
    var row = pos.top;
    while(!size.height) {
      if(id !== this.getElementInCell(row, pos.left)) {
        size.height = row-pos.top;
      }
      row++;
    }
    var column = pos.left;
    while(!size.width) {
      if(id !== this.getElementInCell(pos.top, column)) {
        size.width = column-pos.left;
      }
      column++;
    }
    return size;
  };

  p.getElementPosition = function(id) {
    var current;
    for(var top = 0, rows = this.rows; top < rows; ++top) {
      for(var left = 0, columns = this.columns; left < columns; ++left) {
        current =  this.getElementInCell(top, left);
        if(current === id) {
          return {top: top, left: left};
        }
      }
    }
  };

  p.getElementRect = function(id) {
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

  return GridLayout;

}());