import mktree from "./tree.js";

const r = (route, expected = route) => [route, {
  default: {
    get() {
      return expected;
    },
  },
}];

const routes = [
  r("index"),
  ["svelte/+layout", { default: _ => _, recursive: true }],
  r("svelte/post-add"),
  r("svelte/svelte"),
  ["svelte/test/+layout", { default: _ => _, recursive: true }],
  r("svelte/test/index", "svelte/test"),
  r("svelte-nodb"),
  r("svelte"),
  r("test"),
  r("tests"),
  r("undefined"),
  r("url"),
  r("vue"),
  r("webc"),
  r("ws"),
  r("[p1]", "p1"),
  r("[p1]/[p2]", "p1/p2"),
  r("[p1]/[p2]/[p3]", "p1/p2/p3"),
  r("svelte/[p2]", "svelte/p2"),
  r("[p1]/svelte", "p1/svelte"),
  r("bool/[b1=boolean]", "b1"),
];

const tree = mktree(routes);
const match = assert => (route, expected, expected_params) => {
  const matched = tree.match(route);
  assert(matched.file.default.get()).equals(expected);
  if (expected_params) {
    for (const key of Object.keys(expected_params)) {
      assert((matched.params ?? {})[key]).equals(expected_params[key]);
    }
  }
};

export default test => {
  test.case("errors", assert => {
    const r1 = [
      r("[p1]", "p1"),
      r("[p2]", "p2"),
    ];
    assert(() => mktree(r1)).throws("doubled route");
    const r2 = [
      r("s/[p1]", "s/p1"),
      r("s/[p2]", "s/p2"),
    ];
    assert(() => mktree(r2)).throws("doubled route");
    const r3 = [
      r("[p1]", "p1"),
      r("[p1=number]", "p1=number"),
    ];
    assert(() => mktree(r3)).throws("doubled route");
    const r4 = [
      r("s/[p1]", "s/p1"),
      r("[p1]/s", "p1/s"),
    ];
    assert(() => mktree(r4)).nthrows();
  });

  test.case("tree", assert => {
    const matcher = match(assert);
    matcher("/", "index");
    matcher("/ws", "ws");
    matcher("/ws/", "ws");
    matcher("/svelte", "svelte");
    matcher("/svelte//", "svelte");
    matcher("/svelte-nodb", "svelte-nodb");
    matcher("/svelte/svelte", "svelte/svelte");
    matcher("/svelte/svelte/", "svelte/svelte");
    matcher("/svelte/test", "svelte/test");
    matcher("/svelte/test/", "svelte/test");
    matcher("/svelte/test2", "svelte/p2", { p2: "test2" });
    matcher("/svelte/test2/", "svelte/p2", { p2: "test2" });
    matcher("/svelte/svelte", "svelte/svelte");
    matcher("/test/svelte", "p1/svelte", { p1: "test" });
    matcher("/test/svelte/", "p1/svelte", { p1: "test" });
    matcher("/a", "p1", { p1: "a" });
    matcher("/b", "p1", { p1: "b" });
    matcher("/a/b", "p1/p2", { p1: "a", p2: "b" });
    matcher("/b/a", "p1/p2", { p1: "b", p2: "a" });
    matcher("/a/b/c", "p1/p2/p3", { p1: "a", p2: "b", p3: "c" });
    matcher("/bool/true", "b1", { "b1=boolean": "true" });
  });
};