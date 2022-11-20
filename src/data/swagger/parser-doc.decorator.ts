import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger'

export function GetWalletAddressDocDecorator() {
  return applyDecorators(
    ApiOperation({
      summary:
        'This API allows user to get their wallet address by providing key-id from AWS KMS',
    }),
    ApiParam({
      name: 'keyId',
      description: 'sample keyId: 9d700837-ea26-4c86-845c-d00893a96303',
    }),
    ApiOkResponse({
      status: 200,
      description: 'Success',
      schema: {
        example: {
          statusCode: 200,
          message: 'Success',
          data: [
            {
              walletAddress: '0x1de263ab68e9Ee674421C88733D4b7FFA62b20cB',
            },
          ],
        },
      },
    }),
  )
}
