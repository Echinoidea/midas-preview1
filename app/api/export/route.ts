import { utils, writeFile } from 'xlsx';
export async function POST(request: Request) {
  try {
    const { listStudents } = await request.json();
    //generate worksheet and workbook
    const worksheet = utils.json_to_sheet(listStudents);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Students');
    return Response.json(workbook, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
