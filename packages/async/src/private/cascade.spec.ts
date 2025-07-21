import cascade, { type CascadeFunction } from "#cascade";
import test from "@rcompat/test";

const last = -1;
// sync slicer
const s = (_: string) => _.slice(0, last);
// async slicer
const as = async (_: string) => _.slice(0, last);
// sync slicer + next
const sn: CascadeFunction<string, string> = (_, next) => next?.(_.slice(0, last));
// async slicer + next
const asn: CascadeFunction<string, string | undefined> = async (_, next) => next?.(_.slice(0, last));

test.case("0 case", async assert => {
  assert(await (await cascade([]))("test")).equals("test");
});
test.case("1 case", async assert => {
  // last doesn't call next
  assert(await (cascade([s]))("test")).equals("tes");
  assert(await (cascade([as]))("test")).equals("tes");
  assert(await (cascade([sn]))("test")).equals("tes");
  assert(await (cascade([asn]))("test")).equals("tes");
});
test.case("n case", async assert => {
  assert(await (cascade([sn, sn]))("test")).equals("te");
  assert(await (cascade([asn, asn]))("test")).equals("te");
});
test.case("initial", async assert => {
  // last doesn't call next
  assert(await (cascade([sn], s))("test")).equals("te");
  assert(await (cascade([asn], s))("test")).equals("te");
  assert(await (cascade([sn], as))("test")).equals("te");
  assert(await (cascade([asn], as))("test")).equals("te");
});
