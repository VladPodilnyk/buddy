# Buddy

A simple chat app

🚧 Under construction 🚧

TODOs:

- [x] Clean repo a bit, remove unncessary deps before migrating to workers
- [x] Deploy UI starter code in a worker
- [ ] Create API worker for the UI, use Hono or tRPC for type-safety
- [ ] Bind UI and Search service
- [ ] Setup messages DB
- [ ] Implement Chat service
- [ ] Implmenet UI
- [ ] Auth

Approximate new structure:

```
workers/
--- ui
--- search
--- room
```
