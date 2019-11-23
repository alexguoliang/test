class Mvue {
    constructor(optinos) {
        this.$data = optinos.data;
        this.observe(this.$data);
    }
    observe(value) {
        if (!value || typeof (value) !== 'object') return;
        Object.keys(value).forEach(key => {
            this.defineReactive(value, key, value[key]);
        })
    }
    defineReactive(obj, key, val) {
        this.observe(val);
        Object.defineProperty(obj, key, {
            get() {
                return val;
            },
            set(newVal) {
                if (val === newVal) return;
                val = newVal
                console.log(`${key}值变更为${val}`);
            }
        })
    }
}