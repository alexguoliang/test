class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.compile(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }

    }

    node2Fragment(el) {
        const frag = document.createDocumentFragment();
        let child;
        while (child = el.firstChild) {
            frag.appendChild(child);
        }
        return frag
    }

    compile(el) {
        const childNode = el.childNodes;
        Array.from(childNode).forEach(node => {
            if (this.isElement(node)) {
                console.log(`编译元素${node.nodeName}`)
            } else if (this.isInterPolation(node)) {
                this.compileText(node);
            }
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        });
    }

    isElement(node) {
        return node.nodeType === 1;
    }

    isInterPolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    compileText(node) {
        this.update(node,this.$vm,RegExp.$1,'text' )
    }

    update(node, vm, exp, dir) {
        const updateFn = this[dir + 'Updater'];
        updateFn && updateFn(node, vm[exp])
        new Watcher(vm, exp, function (value) {
            updateFn && updateFn(node, value)
        });
    }

    textUpdater(node,value) {
        node.textContent = value;
    }

}