(function() {

  var slice = Array.prototype.slice;

  // Polymer element

  Polymer('ab-grid', {

    columns: 10,
    rows: 10,
    gutter: 15,
    resizable: true,
    removable: true,
    movable: true,

    _clickZoneSize: 20,

    _resizedEl: null,
    _draggedEl: null,
    _mouseDragOffset: null,

    domReady: function() {
      this._layout = new GridLayout(this.columns, this.rows);
      this._watchMutations();
      this._updateAndRender();
    },

    isDragging: function() {
      return !!this._draggedEl;
    },

    isResizing: function() {
      return !!this._resizedEl;
    },

    getCellSize: function() {
      return {
        width: (this.clientWidth - (this.gutter * (this.columns-1)))/this.columns,
        height: (this.clientHeight - (this.gutter * (this.rows-1)))/this.rows,
      };
    },

    getRoundedSize: function(width, height) {
      var cellSize = this.getCellSize();
      var gridPos = this.toGridSpace(width, height);
      var hGutterOffset = gridPos.column ? (gridPos.column-1)* this.gutter : 0;
      var vGutterOffset = gridPos.row ? (gridPos.row-1)* this.gutter : 0;
      return {
        width: gridPos.column * cellSize.width + hGutterOffset,
        height: gridPos.row * cellSize.height + vGutterOffset
      };
    },

    toGridSpace: function(x, y) {

      var cellSize = this.getCellSize();
      var hRatio = x/(cellSize.width + this.gutter);
      var hFloor = hRatio >> 0;
      var hOffset = ((hRatio - hFloor > 0.25) ? 1 : 0);
      var vRatio = y/(cellSize.height + this.gutter);
      var vFloor = vRatio >> 0;
      var vOffset = ((vRatio - vFloor > 0.25) ? 1 : 0);

      return {
        column: hFloor + hOffset,
        row: vFloor + vOffset
      };

    },

    render: function() {

      var self = this;
      var cellSize = this.getCellSize();
      var elements = self.$.content.getDistributedNodes();

      slice.call(elements).forEach(function(el) {

        var rect = self._layout.getElementRect(el);

        el.style.left = rect.left * cellSize.width + rect.left * self.gutter;
        el.style.top = rect.top * cellSize.height + rect.top * self.gutter;

        el.draggable = self.draggable;
        el.classList.toggle('resizable', self.resizable);
        el.classList.toggle('removable', self.removable);

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

      });
    },

    _watchMutations: function() {
      var observer = new MutationObserver(this._updateAndRender.bind(this));
      var config = {childList: true};
      observer.observe(this, config);
    },

    _updateAndRender: function() {
      this._updateGridLayout();
      this.render();
    },

    _updateGridLayout: function() {
      var self = this;
      var elements = self.$.content.getDistributedNodes();
      slice.call(elements).forEach(function(element) {
        var rect = {
          top: +element.dataset.gridTop,
          left: +element.dataset.gridLeft,
          width: +element.dataset.gridWidth,
          height: +element.dataset.gridHeight
        };
        self._layout.insert(element, rect);
        self.asyncFire('grid-element-insert', {element: element, rect: rect});
      });
    },

    _inResizeZone: function(el, x, y) {
      var width = el.clientWidth;
      var height = el.clientHeight;
      return x >= width - this._clickZoneSize && y >= height - this._clickZoneSize;
    },

    _inRemoveZone: function(el, x, y) {
      var width = el.clientWidth;
      return x >= width - this._clickZoneSize && y <= this._clickZoneSize;
    },

    _getRelativeMousePos: function(evt, el) {
      var rect = (el || evt.target).getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    },

    /* Remove */

    _removeElement: function(evt) {
      if(this.removable) {
        var pos = this._getRelativeMousePos(evt);
        var el = evt.target;
        if(this._inRemoveZone(el, pos.x, pos.y)) {
          this.removeChild(el);
          this._layout.remove(el);
          this.asyncFire('grid-element-remove', {element: el});
          //this._layout.compact();
          this.render();
        }
      }
    },

    /* Drag & Drop */

    _dragStart: function(evt) {

      var el = evt.target;
      var gridId = this._layout.getElementId(el);

      if(this.movable && !this.isResizing() && gridId) {

        var dataTransfer = evt.dataTransfer;
        dataTransfer.setData('application/x-ab-grid-id', gridId);
        dataTransfer.effectAllowed = 'move';
        this._draggedEl = el;
        this._mouseDragOffset = this._getRelativeMousePos(evt, el);

        el.classList.add('moving');
        this._togglePlaceholder(false);
      }

    },

    _dragEnd: function(evt) {
      if(this.movable && this.isDragging()) {
        this._draggedEl.classList.remove('moving');
        this._draggedEl = null;
        this.render();
      }
    },

    _dragOver: function(evt) {

      if(this.movable && this.isDragging()) {

        if (evt.preventDefault) {
          evt.preventDefault();
        }

        evt.dataTransfer.dropEffect = 'move';

        var el = this._draggedEl;
        var cellSize = this.getCellSize();
        var pos = this._getRelativeMousePos(evt, this);
        var rect = el.getBoundingClientRect();
        var id = this._layout.getElementId(el);

        var grid = this.toGridSpace(pos.x - this._mouseDragOffset.x, pos.y - this._mouseDragOffset.y);

        this._updatePlaceholder({
          top: grid.row * cellSize.height + grid.row * this.gutter,
          left: grid.column * cellSize.width + grid.column * this.gutter,
          width: rect.width,
          height: rect.height
        });

        var moved = this._layout.move(id, grid.row, grid.column);
        if(moved) {
          this.asyncFire('grid-element-move', {element: el, rect: this._layout.getElementRect(id)});
        }
        //this._layout.compact();

        this.render();

        return false;

      }

    },

    /* Resizing */

    _startResizing: function(evt) {

      if(this.resizable && !this.isDragging()) {

        var pos = this._getRelativeMousePos(evt);

        if(this.isResizing() || this._inResizeZone(evt.target, pos.x, pos.y)) {

          var el = this._resizedEl = evt.target;
          var rect = this._getResizePlaceholderRect(el);

          el.classList.add('moving');
          this._updatePlaceholder(rect);
          this._togglePlaceholder(true);

          // Prevent D&D
          evt.preventDefault();
          return false;

        }

      }

    },

    _stopResizing: function() {

      if(this.resizable && this.isResizing()) {

        var el = this._resizedEl;
        var rect = el.getBoundingClientRect();
        var roundedSize = this.getRoundedSize(rect.width, rect.height);

        el.style.width = roundedSize.width;
        el.style.height = roundedSize.height;

        this._togglePlaceholder(false);
        el.classList.remove('moving');
        this._resizedEl = null;

      }

    },

    _resize: function(evt) {

      if(this.resizable && this.isResizing()) {

        var el = this._resizedEl;
        var left = +el.dataset.gridLeft;
        var top = +el.dataset.gridTop;

        var rect = el.getBoundingClientRect();
        var roundedSize = this.getRoundedSize(rect.width, rect.height);
        var cellSize = this.getCellSize();
        var width = roundedSize.width / cellSize.width >> 0;
        var height = roundedSize.height / cellSize.height >> 0;
        var id = this._layout.getElementId(el);

        var resized = this._layout.resize(id, width, height);
        if(resized) {
          this.asyncFire('grid-element-resize', {element: el, rect: this._layout.getElementRect(id)});
        }
        //this._layout.compact();

        this.render();

        if(resized) {
          var rect = el.getBoundingClientRect();
          el.style.width = evt.pageX - rect.left - window.scrollX;
          el.style.height = evt.pageY - rect.top - window.scrollY;
          var rect = this._getResizePlaceholderRect(el);
          this._updatePlaceholder(rect);
        }

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

    _getResizePlaceholderRect: function(el) {

      var rect = {};
      var left = +el.dataset.gridLeft || 0;
      var top = +el.dataset.gridTop || 0;
      var elRect = el.getBoundingClientRect();
      var cellSize = this.getCellSize();
      var roundedSize = this.getRoundedSize(elRect.width, elRect.height);

      rect.left = left * cellSize.width + left * this.gutter;
      rect.top = top * cellSize.height + top * this.gutter;
      rect.height = roundedSize.height;
      rect.width = roundedSize.width;

      return rect;

    }

});
}());