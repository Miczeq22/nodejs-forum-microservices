"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const building_blocks_1 = require("@myforum/building-blocks");
(async () => {
    const service = new building_blocks_1.ServiceBuilder().setName('posts').build();
    await service.bootstrap();
    const port = Number(process.env.APP_PORT) || 4000;
    await service.listen(port);
})();
//# sourceMappingURL=index.js.map