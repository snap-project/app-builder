(function() {

  var slice = Array.prototype.slice;

  // Polymer element

  Polymer('ab-grid', {

    columns: 10,
    rows: 10,
    gutter: 15,

    _resizeZoneSize: 20,
    _resizedElem: null,
    _draggedEl: null,

    domReady: function() {
      this._layout = new GridLayout(this.columns, this.rows);
      this._initializeGrid();
      this.render();
    },

    _initializeGrid: function() {
      var self = this;
      var elements = self.$.content.getDistributedNodes();
      slice.call(elements).forEach(function(element) {
        self._layout.insert(element, {
          top: +element.dataset.gridTop,
          left: +element.dataset.gridLeft,
          width: +element.dataset.gridWidth,
          height: +element.dataset.gridHeight
        });
      });
    },

    getCellSize: function() {
      return {
        width: (this.clientWidth - (this.gutter * (this.columns-1)))/this.columns,
        height: (this.clientHeight - (this.gutter * (this.rows-1)))/this.rows,
      };
    },

    getRoundedSize: function(width, height) {
      var cellSize = this.getCellSize();
      var hRatio = width/(cellSize.width + this.gutter);
      var hFloor = hRatio >> 0;
      var hOffset = ((hRatio - hFloor > 0.10) ?  1 : 0);
      var vRatio = height/(cellSize.height + this.gutter);
      var vFloor = vRatio >> 0;
      var vOffset = ((vRatio - vFloor > 0.10) ?  1 : 0);
      return {
        width: (hFloor + hOffset) * cellSize.width + (hOffset ?  hFloor : hFloor-1) * this.gutter,
        height: (vFloor + vOffset) * cellSize.height + (vOffset ?  vFloor : vFloor-1) * this.gutter,
      };
    },

    getSnappedPos: function(top, left) {
      var cellSize = this.getCellSize();
      var hRatio = left/(cellSize.width + this.gutter);
      var vRatio = top/(cellSize.height + this.gutter);
      return {
        left: (hRatio >> 0) * cellSize.width,
        top: (vRatio >> 0) * cellSize.height
      };
    },

    render: function() {

      var self = this;
      var cellSize = this.getCellSize();
      var elements = self.$.content.getDistributedNodes();

      slice.call(elements).forEach(function(el) {

        var id = self._layout.getElementId(el);
        var rect = self._layout.getElementRect(id);

        el.style.left = rect.left * cellSize.width + rect.left * self.gutter;
        el.style.top = rect.top * cellSize.height + rect.top * self.gutter;

        el.draggable = true;

        // Update data attributes
        el.dataset.gridWidth = rect.width;
        el.dataset.gridHeight = rect.height;
        el.dataset.gridLeft = rect.left;
        el.dataset.gridTop = rect.top;

        // Update size and position
        el.style.height = rect.height * cellSize.height + ((rect.height-1) * self.gutter);
        el.style.width = rect.width * cellSize.width + ((rect.width-1) * self.gutter);
        el.style.minWidth = cellSize.width;
        el.style.minHeight = cellSize.height;
        el.innerHTML = el.dataset.gridId;

      });
    },

    _inResizeZone: function(el, x, y) {
      var width = el.clientWidth;
      var height = el.clientHeight;
      return x >= width - this._resizeZoneSize && y >= height - this._resizeZoneSize;
    },

    _getRelativeMousePos: function(evt, el) {
      var rect = (el || evt.target).getBoundingClientRect();
      return {
        left: evt.clientX - rect.left,
        top: evt.clientY - rect.top
      };
    },

    /* Drag & Drop */

    _dragStart: function(evt) {
      var dataTransfer = evt.dataTransfer;
      dataTransfer.effectAllowed = 'move';
      dataTransfer.dropEffect = 'move';
      var id = this._layout.getElementId(evt.srcElement);
      this._draggedEl = evt.srcElement;
      evt.srcElement.classList.add('moving');
      dataTransfer.setData('application/x-ab-grid', id);
      this._togglePlaceholder(true);
    },

    _dragEnd: function(evt) {
      evt.srcElement.classList.remove('moving');
      this._togglePlaceholder(false);
      this._draggedEl = null;
      this.render();
    },

    _dragOver: function(evt) {
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      var pos = this._getRelativeMousePos(evt, this);
      var rect = this._draggedEl.getBoundingClientRect();
      var snappedPos = this.getSnappedPos(pos.left, pos.top);
      this._updatePlaceholder({
        top: snappedPos.top,
        left: snappedPos.left,
        width: rect.width,
        height: rect.height
      });
      this.render();
      return false;
    },

    /* Resizing */

    _startResizing: function(evt) {
      var pos = this._getRelativeMousePos(evt);
      if(this._resizedElem || this._inResizeZone(evt.target, pos.left, pos.top)) {
        this._resizedElem = evt.target;
        this._updateResizePlaceholder(this._resizedElem);
        this._togglePlaceholder(true);
        evt.preventDefault();
      }
    },

    _stopResizing: function() {
      var el = this._resizedElem;
      if(el) {
        var rect = el.getBoundingClientRect();
        var roundedSize = this.getRoundedSize(rect.width, rect.height);
        el.style.width = roundedSize.width;
        el.style.height = roundedSize.height;
        this._togglePlaceholder(false);
      }
      this._resizedElem = null;
    },

    _resize: function(evt) {
      var el = this._resizedElem;
      if(el) {

        var left = +el.dataset.gridLeft;
        var top = +el.dataset.gridTop;

        var rect = el.getBoundingClientRect();
        var roundedSize = this.getRoundedSize(rect.width, rect.height);
        var cellSize = this.getCellSize();
        var width = roundedSize.width / cellSize.width >> 0;
        var height = roundedSize.height / cellSize.height >> 0;
        var id = this._layout.getElementId(el);

        this._layout.resize(id, width, height);
        this._layout.compact();

        this.render();

        var rect = el.getBoundingClientRect();
        el.style.width = evt.pageX - rect.left - window.scrollX;
        el.style.height = evt.pageY - rect.top - window.scrollY;

        this._updateResizePlaceholder(el);

        evt.preventDefault();
      }
    },

    _togglePlaceholder: function(isVisible) {
      this.$.placeholder.style.display = isVisible ? 'block' : 'none';
    },

    _updatePlaceholder: function(rect) {
      var cellSize = this.getCellSize();
      var placeholder = this.$.placeholder;
      placeholder.style.minWidth = cellSize.width;
      placeholder.style.minHeight = cellSize.height;
      placeholder.style.height = rect.height;
      placeholder.style.width = rect.width;
      placeholder.style.left = rect.left;
      placeholder.style.top = rect.top;
    },

    _updateResizePlaceholder: function(el) {
      var placeholder = this.$.placeholder;
      var cellSize = this.getCellSize();
      var rect = el.getBoundingClientRect();
      var roundedSize = this.getRoundedSize(rect.width, rect.height);
      var left = +el.dataset.gridLeft || 0;
      var top = +el.dataset.gridTop || 0;
      placeholder.style.minWidth = cellSize.width;
      placeholder.style.minHeight = cellSize.height;
      placeholder.style.height = roundedSize.height;
      placeholder.style.width = roundedSize.width;
      placeholder.style.left = left * cellSize.width + left * this.gutter;
      placeholder.style.top = top * cellSize.height + top * this.gutter;
    }

});
}());