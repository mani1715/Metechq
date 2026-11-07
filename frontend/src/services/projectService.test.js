import projectService from './projectService';
import api from './api';
jest.mock('./api', () => ({get:jest.fn()}));
afterEach(() => jest.clearAllMocks());
test('loads more than 100 projects, galleries and deployed links', async () => {
  const first = Array.from({length:100},(_,id)=>({id:String(id),title:`Project ${id}`,image_url:'https://example.com/cover.png',gallery_images:['https://example.com/detail.png'],live_demo_url:'https://example.com/app'}));
  api.get.mockResolvedValueOnce({data:first}).mockResolvedValueOnce({data:[{id:'100',title:'Last project'}]});
  const result = await projectService.getPublicProjects();
  expect(result).toHaveLength(101);
  expect(api.get).toHaveBeenLastCalledWith('/projects/',{params:{offset:100,limit:100}});
  expect(result[0].images).toEqual(['https://example.com/cover.png','https://example.com/detail.png']);
  expect(result[0].live_demo_url).toBe('https://example.com/app');
});
test('does not turn an API failure into an empty successful portfolio',async()=>{
  api.get.mockRejectedValue(new Error('Offline'));
  await expect(projectService.getPublicProjects()).rejects.toThrow('Offline');
});
test('filters private records and unsafe stored links',async()=>{
  api.get.mockResolvedValue({data:[{id:'private',is_private:true},{id:'public',live_demo_url:'javascript:alert(1)'}]});
  const result=await projectService.getPublicProjects();
  expect(result).toHaveLength(1);expect(result[0].live_demo_url).toBe('');
});

test('admin portfolio includes records beyond the first page', async () => {
  api.get.mockResolvedValueOnce({data:Array.from({length:100},(_,id)=>({id:String(id)}))})
    .mockResolvedValueOnce({data:[{id:'100',is_private:true}]});
  const projects=await projectService.getAllProjects();
  expect(projects).toHaveLength(101);
  expect(projects[100].is_private).toBe(true);
  expect(api.get).toHaveBeenLastCalledWith('/projects/all',{params:{offset:100,limit:100}});
});
