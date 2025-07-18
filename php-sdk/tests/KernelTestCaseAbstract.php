<?php declare(strict_types=1);

namespace Pipes\PhpSdk\Tests;

use Closure;
use Hanaboso\CommonsBundle\Transport\Curl\CurlException;
use Hanaboso\CommonsBundle\Transport\Curl\CurlManager;
use Hanaboso\CommonsBundle\Transport\Curl\Dto\RequestDto;
use Hanaboso\CommonsBundle\Transport\Curl\Dto\ResponseDto;
use Hanaboso\PhpCheckUtils\PhpUnit\Traits\CustomAssertTrait;
use Hanaboso\PhpCheckUtils\PhpUnit\Traits\PrivateTrait;
use Hanaboso\PhpCheckUtils\PhpUnit\Traits\RestoreErrorHandlersTrait;
use Hanaboso\Utils\String\Json;
use phpmock\phpunit\PHPMock;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Throwable;

/**
 * Class KernelTestCaseAbstract
 *
 * @package Pipes\PhpSdk\Tests
 */
abstract class KernelTestCaseAbstract extends KernelTestCase
{

    use PrivateTrait;
    use CustomAssertTrait;
    use PHPMock;
    use RestoreErrorHandlersTrait;

    /**
     *
     */
    protected function setUp(): void
    {
        parent::setUp();

        self::bootKernel();
    }

    /**
     * @phpstan-param class-string<Throwable> $exception
     *
     * @param string      $exception
     * @param int|null    $exceptionCode
     * @param string|null $exceptionMessage
     * @param bool        $isExact
     */
    protected function assertException(
        string $exception,
        ?int $exceptionCode = NULL,
        ?string $exceptionMessage = NULL,
        bool $isExact = TRUE,
    ): void
    {
        self::expectException($exception);

        if ($exceptionCode) {
            self::expectExceptionCode($exceptionCode);
        }

        if ($exceptionMessage) {
            $isExact
                ? self::expectExceptionMessageMatches(sprintf('/^%s$/', preg_quote($exceptionMessage)))
                : self::expectExceptionMessageMatches($exceptionMessage);
        }
    }

    /**
     * @param Closure ...$closures
     *
     * @return CurlManager
     */
    protected function prepareSender(Closure ...$closures): CurlManager
    {
        $sender = self::createPartialMock(CurlManager::class, ['send']);
        $sender
            ->expects(self::exactly(count($closures)))
            ->method('send')
            ->willReturnOnConsecutiveCalls($closures);

        return $sender;
    }

    /**
     * @param string|mixed[] $data
     * @param string|null    $url
     * @param int            $statusCode
     *
     * @return Closure
     */
    protected function prepareSenderResponse($data = '{}', ?string $url = NULL, int $statusCode = 200): Closure
    {
        return static function (RequestDto $dto) use ($data, $url, $statusCode): ResponseDto {
            if ($url) {
                self::assertSame($url, sprintf('%s %s', $dto->getMethod(), $dto->getUri(TRUE)));
            }

            return new ResponseDto($statusCode, 'OK', is_array($data) ? Json::encode($data) : $data, []);
        };
    }

    /**
     * @param string $message
     *
     * @return Closure
     */
    protected function prepareSenderErrorResponse(string $message = 'Something gone wrong!'): Closure
    {
        return static function () use ($message): void {
            throw new CurlException($message, CurlException::REQUEST_FAILED);
        };
    }

    /**
     * @return void
     */
    protected function tearDown(): void {
        parent::tearDown();

        $this->restoreErrorHandler();
        $this->restoreExceptionHandler();
    }

}
