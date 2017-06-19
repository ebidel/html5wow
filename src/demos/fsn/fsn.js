FSN = function(tree) {
  this.selectedFiles = {};
  this.tree = tree;
  this.cd(FSN.DIR_SEPARATOR);
};
FSN.DIR_SEPARATOR = '/';
FSN.TYPE_FILE = 'file';
FSN.TYPE_DIR = 'dir';

FSN.prototype = {
  tree : null,
  current : null,

  getEntry : function(path) {
    if (path == '') {
      path = this.current.getPath();
    } else if (path == null) {
      path = '/';
    }
    var cur = this.current;
    var elems = path.split('/');
    if (elems[0] == '') {
      cur = this.tree;
    }
    while (elems.length > 0) {
      var seg = elems.shift();
      if (seg != '') {
        if (seg == '..') {
          cur = cur.parent;
        } else if (seg == '.') {
          cur = cur;
        } else if (cur.entries != null) {
          cur = cur.entries[seg];
        } else {
          return null;
        }
      }
    }
    return cur;
  },

  cd : function(path) {
    var cur = this.getEntry(path);
    if (cur == null) {
      throw(new Error('cd: No such path ' + path));
    }
    this.current = cur;
    if (this.onChangeDir) {
      this.onChangeDir(this.getCurrentPath());
    }
  },

  ls : function(path) {
    var cur = path ? this.getEntry(path) : this.current;
    if (cur == null) {
      throw(new Error('ls: No such path ' + path));
    }
    var a = [];
    if (cur.entries != null) {
      for (var i in cur.entries)
        a.push(cur.entries[i]);
    } else {
      a.push(cur);
    }
    a.sort(function(x,y) {
      var xdir = x.entries !== null;
      var ydir = y.entries !== null;
      if (xdir && !ydir) {
        return -1;
      } else if (ydir && !xdir) {
        return 1;
      } else {
        return (x.name < y.name ? -1 : (x.name == y.name ? 0 : 1));
      }
    });
    return a;
  },

  rm : function(path) {
    var cur = this.getEntry(path);
    if (cur == null) {
      throw(new Error('rm: No such path ' + path));
    }
    var parent = cur.parent;
    if (!parent) {
      throw(new Error("rm: Can't delete root directory " + path));
    }
    parent.removeEntry(cur);
    if (this.onRelayoutNeeded)
      this.onRelayoutNeeded(parent);
  },

  createParent : function(path, callerName) {
    if (!callerName) {
      callerName = 'createParent';
    }
    var segs = path.split('/');
    var parent = segs.slice(0,-1).join('/');
    if (parent == "" && segs.length == 2) {
      parent = "/";
    }
    var cur = this.getEntry(parent);
    if (cur == null) {
      this.mkdir(parent);
      cur = this.getEntry(parent);
      if (!cur) {
        throw(new Error(callerName + ': Could not find ' + parent));
      }
    }
    var name = segs.last();
    if (cur.entries == null) {
      throw(new Error(callerName + ": Can't " + callerName + " inside a file " + parent));
    } else if (cur.entries[name]) {
      throw(new Error(callerName + ": File already exists " + path));
    }
    return cur;
  },

  mv : function(src, dst) {
    var e = this.getEntry(src);
    if (!e) {
      throw(new Error("mv: Source file "+src+ " does not exist"));
    } else if (!e.parent) {
      throw(new Error("mv: Can't move root directory."));
    }
    var cur = this.createParent(dst, 'mv');
    var p = e.parent;
    p.removeEntry(e);
    e.name = dst.split('/').last();
    cur.addEntry(e);
    if (this.onRelayoutNeeded) {
      this.onRelayoutNeeded(p);
      this.onRelayoutNeeded(cur);
      this.onRelayoutNeeded(e, true);
    }
  },

  cp : function(src, dst) {
    var e = this.getEntry(src);
    if (!e) {
      throw(new Error("cp: Source file "+src+ " does not exist"));
    }
    var cur = this.createParent(dst, 'cp');
    var copy = e.clone();
    copy.name = dst.split('/').last();
    cur.addEntry(copy);
    if (this.onRelayoutNeeded) {
      this.onRelayoutNeeded(cur, true);
    }
  },

  mkdir : function(path) {
    var cur = this.createParent(path, 'mkdir');
    var entry = new FSN.Entry(path.split('/').last(), 0, {});
    cur.addEntry(entry);
    if (this.onRelayoutNeeded)
      this.onRelayoutNeeded(cur);
  },

  create : function(path, size) {
    size = parseInt(size);
    var cur = this.createParent(path, 'create');
    var entry = new FSN.Entry(path.split('/').last(), size, null);
    cur.addEntry(entry);
    if (this.onRelayoutNeeded)
      this.onRelayoutNeeded(cur);
  },

  touch : function(path) {
    if (!this.getEntry(path)) {
      this.create(path, 0);
    }
  },

  getCurrentPath : function() {
    return this.current.getPath();
  },

  selectFile : function(path) {
    this.selectedFiles[path] = true;
  },

  deselectFile : function(path) {
    delete this.selectedFiles[path];
  },

  flattenLayout : function(layout, arr) {
    arr.push(layout);
    if (layout.entries != null) {
      for (var f in layout.entries) {
        this.flattenLayout(layout.entries[f], arr);
      }
    }
    return arr;
  },

  getLayout : function(path, maxDepth) {
    if (!path)
      path = '/';
    var entry = this.getEntry(path);
    if (entry.entries == null) {
      throw new Error("Can't layout a file: " + path);
    } else {
      return this.flattenLayout(this.createLayout(entry, {x:0, y:0, z:0, scale: 1}, null, maxDepth, 0), []);
    }
  },

  createLayout : function(tree, offset, dir, maxDepth, depth) {
    var layout;
    if (tree.entries == null) {
      // file
      layout = this.createFileLayout(tree, offset, dir);
    } else {
      // directory
      layout = this.createDirLayout(tree, offset, dir, maxDepth, depth);
    }
    return layout;
  },

  createFileLayout : function(file, offset, dir) {
    return {path: file.getPath(), name: file.name, size: file.size, offset: offset, parent: dir};
  },

  createDirLayout : function(tree, offset, dir, maxDepth, depth) {
    var arr = [];
    var fileCount = 0;
    var dirCount = 0;

    for (var f in tree.entries) {
      arr.push(f);
      if (tree.entries[f].entries)
        dirCount++;
      else
        fileCount++;
    }
    arr.sort();
    var squareSide = Math.ceil(Math.sqrt(fileCount));
    var fidx = 0, didx = 0;
    var layout = {path: tree.getPath(), name: tree.name, size: tree.size, offset: offset, entries: {}, parent: dir};
    if (maxDepth != null && depth >= maxDepth) {
      // maximum depth reached
      layout.continuation = true;
    } else {
      for (var i=0; i<arr.length; i++) {
        var entry = tree.entries[arr[i]];
        var off = Object.extend({}, offset);
        if (entry.entries) {
          off.scale = Math.min(0.8, 1/dirCount);
          off.x = off.scale*(-(dirCount-1)/2+didx)*100;
          off.y = off.scale*40;
          off.z = -60;
          didx++;
        } else {
          off.scale = 1/Math.max(3, squareSide);
          var x = fidx%squareSide;
          var y = Math.floor(fidx/squareSide);
          off.x = 60*(x-(squareSide-1)/2)*off.scale;
          off.y = 0*off.scale;
          off.z = -60*(y-(squareSide-1)/2)*off.scale;
          fidx++;
        }
        layout.entries[entry.name] = this.createLayout(entry, off, layout, maxDepth, depth+1);
      }
    }
    return layout;
  }

};


FSN.Entry = function(name, size, entries) {
  this.name = name;
  this.size = size;
  this.entries = entries;
};
FSN.DoubleDirRE = new RegExp(FSN.DIR_SEPARATOR+FSN.DIR_SEPARATOR, 'g');
FSN.Entry.prototype = {
  type : FSN.TYPE_FILE,
  size : 0,

  getPath : function() {
    var o = this;
    var segs = [o.name];
    while (o.parent) {
      o = o.parent;
      segs.unshift(o.name);
    }
    return segs.join(FSN.DIR_SEPARATOR).replace(FSN.DoubleDirRE, FSN.DIR_SEPARATOR);
  },

  addEntry : function(entry) {
    this.entries[entry.name] = entry;
    entry.parent = this;
  },

  removeEntry : function(entry) {
    delete this.entries[entry.name];
    entry.parent = null;
  },

  clone : function() {
    var copy = new FSN.Entry(this.name, this.size, this.entries);
    if (this.entries != null) {
      copy.entries = {};
      for (var i in this.entries) {
        copy.addEntry(this.entries[i].clone());
      }
    }
    return copy;
  }
};


FSN.makeTree = function(tree) {
  var t = new FSN.Entry('/', 0, {});
  for (var f in tree) {
    t.size++;
    if (typeof tree[f] == 'number') {
      t.addEntry(new FSN.Entry(f, tree[f], null));
    } else {
      var d = FSN.makeTree(tree[f]);
      d.name = f;
      t.addEntry(d);
    }
  }
  return t;
};
FSN.buildTreeFromPathList = function(paths, sizes) {
  var tree_ = {};
  if (!sizes) sizes = [];
  for (var i=0; i<paths.length; i++) {
    var path = paths[i];
    var pathParts = path.split('/');
    var subObj = tree_;
    var l = pathParts.length-1;
    for (var j=0; j<l; j++) {
      var folderName = pathParts[j];
      if (typeof subObj[folderName] != 'object') {
        subObj[folderName] = {};
      }
      subObj = subObj[folderName];
    }
    if (pathParts[l] != '.') {
      subObj[pathParts[l]] = sizes[i] || 0;
    }
  }
  return FSN.makeTree(tree_);
};
