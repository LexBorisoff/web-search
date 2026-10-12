import { paths } from './paths.js';

export const bashScript = `#!/usr/bin/env bash

if test -f "${paths.main}"; then
  node "${paths.main}" "$@"
fi
`;

export const bashStartScript = `#!/usr/bin/env bash

if test -d "${paths.bin}"; then
	export PATH=${paths.bin}:$PATH
fi`;

export const powershellScript = `#!/usr/bin/env pwsh

if (Test-Path -Path "${paths.main}") {
  node "${paths.main}" $args
}
`;
