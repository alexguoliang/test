class Kvue {
    constructor(options) {
        this.$data = options.data;
        this.observer(this.$data);
        new Compile(options.el, this)
        if (options.created) {
            options.created.call(this);
        }
    }

    observer(value) {
        if (!value || typeof value !== "object") {
            return;
        }
        Object.keys(value).forEach(key => {
            this.defineReactive(value, key, value[key]);
            this.proxyData(key);
        })
    }

    defineReactive(obj, key, val) {
        const dep = new Dep()
        this.observer(val);
        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.addDep(Dep.target);
                return val
            },
            set(newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal
                dep.notify()
            }
        })
    }

    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set(newVal) {
                this.$data[key] = newVal
            }
        })
    }
}

class Dep {
    constructor() {
        this.deps = [];
    }

    addDep(dep) {
        this.deps.push(dep);
    }

    notify() {
        this.deps.forEach(dep => dep.upDate());
    }
}

class Watcher {
    constructor(vm, key, cd) {
        this.vm = vm;
        this.key = key;
        this.cd = cd;
        Dep.target = this;
        this.vm[this.key]
        Dep.target = null;
    }

    upDate() {
        this.cd.call(this.vm, this.vm[this.key]);
    }
}
